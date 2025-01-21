from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Question, QuestionOption, Quiz, QuizAttempt


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        # Ensure password is validated with a minimum length
        password = validated_data.get('password')
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long.")

        user = User.objects.create_user(
            username=validated_data['username'],
            password=password
        )
        return user

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ["id", "option", "is_correct"]

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'total_score', 'questions']

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)  # Assuming user is related to the attempt
    class Meta:
        model = QuizAttempt
        fields = ['id', 'username', 'quiz', 'score', 'attempt_time']
