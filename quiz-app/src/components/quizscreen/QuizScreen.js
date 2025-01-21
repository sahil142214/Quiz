import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";  // Import the custom Axios instance
import './QuizScreen.css';  // Import the CSS for styling

const QuizScreen = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Please log in.");
          return;
        }
        const response = await api.get(`/api/questions/${quizId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setErrorMessage("Failed to fetch quiz. Unauthorized access.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Handle user answer change
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;  // Prevent double submissions
    setIsSubmitting(true);

    try {
      const score = calculateScore();
      const username = localStorage.getItem("username");
      const quizId = localStorage.getItem("quizId");

      if (!username || !quizId) {
        setErrorMessage("Missing username or quiz ID.");
        setIsSubmitting(false);
        return;
      }

      await api.post("/api/submit_quiz/", {
        username,
        quiz_id: quizId,
        score,
      });

      navigate("/quiz_archive");
    } catch (error) {
      setErrorMessage("Failed to submit quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate score based on user answers
  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = question.options.find(
        (option) => option.id === selectedOptionId
      );
      if (selectedOption?.is_correct) {
        score += 1;
      }
    });
    return score;
  };

  // Loading and error messages
  if (isLoading) return <div className="loading">Loading quiz...</div>;
  if (errorMessage) return <div className="error-message">{errorMessage}</div>;
  if (!questions.length) return <div>No questions available.</div>;

  const isAllAnswered = questions.every((question) => answers[question.id]);

  return (
    <div className="quiz-screen">
      <h2>Quiz: {questions[0]?.quiz_title}</h2>
      {questions.map((question) => (
        <div key={question.id} className="question">
          <p className="question-text">{question.question}</p>
          {question.options.map((option) => (
            <div key={option.id} className="option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                onChange={() => handleAnswerChange(question.id, option.id)}
                checked={answers[question.id] === option.id}
              />
              <label>{option.option}</label>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmitQuiz}
        disabled={isSubmitting || !isAllAnswered}
        className="submit-button"
      >
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
};

export default QuizScreen;
