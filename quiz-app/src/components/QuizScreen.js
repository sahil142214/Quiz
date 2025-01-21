import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";  // Import the custom Axios instance

const QuizScreen = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);  // Track submission state

  // Fetch quiz data on component mount
 useEffect(() => {
  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please log in.");
        return;
      }
      console.log("Fetching quiz with ID:", quizId); // Debugging line
      const response = await api.get(`/api/questions/${quizId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Quiz data:", response.data); // Debugging line
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

 const handleSubmitQuiz = async () => {
  if (isSubmitting) return;  // Prevent double submissions
  setIsSubmitting(true);  // Set submitting state to true

  try {
    const score = calculateScore();  // Calculate score
    const username = localStorage.getItem("username");
    const quizId = localStorage.getItem("quizId");  // Ensure quizId is set in localStorage

    if (!username || !quizId) {
      setErrorMessage("Missing username or quiz ID.");
      setIsSubmitting(false);  // Reset submitting state
      return;
    }

    await api.post("/api/submit_quiz/", {
      username,       // Pass the username
      quiz_id: quizId, // Pass the quiz_id
      score,
    });

    navigate("/quiz_archive");  // Redirect after submission
  } catch (error) {
    setErrorMessage("Failed to submit quiz.");
  } finally {
    setIsSubmitting(false);  // Reset submitting state
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
        score += 1;  // Increment score for correct answers
      }
    });
    return score;
  };

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (errorMessage) {
    return <div style={{ color: 'red' }}>{errorMessage}</div>;
  }

  if (!questions.length) {
    return <p>Unable to load quiz or questions.</p>;
  }

  const isAllAnswered = questions.every((question) => answers[question.id]);

  return (
    <div>
      <h2>Quiz</h2>
      {questions.map((question) => (
        <div key={question.id}>
          <p>{question.question}</p>
          {question.options.map((option) => (
            <div key={option.id}>
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
      <button onClick={handleSubmitQuiz} disabled={isSubmitting || !isAllAnswered}>
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
};

export default QuizScreen;
