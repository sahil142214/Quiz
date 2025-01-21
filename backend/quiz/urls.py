from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [

    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    # Register a new user
    path('register/', views.RegisterView.as_view(), name='register'),

    # Login and get JWT token
    path('login/', views.LoginView.as_view(), name='login'),


    # Fetch all quizzes
    path("quizzes/", views.quizzes, name="quizzes"),

    # Fetch questions for a specific quiz by its ID
    path("questions/<int:quiz_id>/", views.questions, name="questions"),

    # Check if the user has taken the quiz
    path("has_taken_quiz/", views.has_taken_quiz, name="has_taken_quiz"),

    # Submit a quiz
    path("submit_quiz/", views.submit_quiz, name="submit_quiz"),

    # Archive page to show all attempted quizzes of a user
    path("quiz_archive/<str:username>/", views.quiz_archive, name="quiz_archive"),
]
