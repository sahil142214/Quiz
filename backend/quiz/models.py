from django.db import models




class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    total_score = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE,null=True)
    question = models.CharField(max_length=500, unique=True)

    def __str__(self):
        return f"{self.question} ({self.quiz.title if self.quiz else 'No Quiz'})"


class QuestionOption(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    option = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.option} for {self.question.question}"


class QuizAttempt(models.Model):
    username = models.CharField(max_length=20, blank=True, null=True)
    quiz = models.ForeignKey(Quiz, related_name='attempts', on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    attempt_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt by {self.username} for {self.quiz.title}"

