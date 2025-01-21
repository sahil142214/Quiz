from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Quiz, Question, QuizAttempt
from .serializers import QuestionSerializer, QuizSerializer, QuizAttemptSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        # Check if username already exists
        if User.objects.filter(username=request.data.get('username')).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            # Create the user if data is valid
            user = serializer.save()

            # Return success response
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=400)

        user = authenticate(username=username, password=password)
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=200)
        else:
            return Response({"detail": "Invalid credentials."}, status=401)



# View to fetch the list of all quizzes
@api_view(['GET'])
def quizzes(request):
    quizzes = Quiz.objects.all()
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def questions(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = Question.objects.filter(quiz=quiz)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def has_taken_quiz(request):
    username = request.data.get("username")
    quiz_id = request.data.get("quiz_id")

    if not username or not quiz_id:
        return Response({"error": "Username and quiz_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Ensure the user is authenticated
    if username != request.user.username:
        return Response({"error": "You can only check your own quiz status."}, status=403)

    quiz = get_object_or_404(Quiz, id=quiz_id)

    # Check if the user has already attempted this quiz
    attempt = QuizAttempt.objects.filter(username=username, quiz=quiz).first()

    if attempt and attempt.score > 0:  # assuming score > 0 indicates quiz completion
        return Response({"error": f'{username} has already taken this quiz'}, status=403)

    return Response({"message": "Proceed to take your quiz", "quiz_id": quiz_id})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request):
    username = request.data.get("username")
    quiz_id = request.data.get("quiz_id")
    score = request.data.get("score")

    if not username or not quiz_id or score is None:
        return Response({"error": "Username, quiz_id, and score are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Ensure the user is authenticated and the username matches the authenticated user
    if username != request.user.username:
        return Response({"error": "You can only submit your own quiz."}, status=403)

    quiz = get_object_or_404(Quiz, id=quiz_id)

    # Create or update quiz attempt
    attempt, created = QuizAttempt.objects.get_or_create(username=username, quiz=quiz)

    # Validate and update score
    if score < 0:
        return Response({"error": "Score cannot be negative."}, status=status.HTTP_400_BAD_REQUEST)

    attempt.score = score
    attempt.save()

    return Response({"message": "Quiz submitted successfully!"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quiz_archive(request, username):
    # Ensure the user is authenticated and the username matches the authenticated user
    if username != request.user.username:
        return Response({"error": "You can only access your own quiz archive."}, status=403)

    attempts = QuizAttempt.objects.filter(username=username, score__gt=0)

    if not attempts:
        return Response({"message": "No quiz attempts found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = QuizAttemptSerializer(attempts, many=True)

    return Response(serializer.data)

