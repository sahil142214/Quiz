# Generated by Django 5.1.4 on 2025-01-14 02:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0002_quiz_question_quiz_quizattempt'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quizattempt',
            name='student',
        ),
        migrations.AddField(
            model_name='quizattempt',
            name='username',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.DeleteModel(
            name='Student',
        ),
    ]
