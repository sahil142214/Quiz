import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/quizzes/");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setErrorMessage("Failed to load quizzes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

const handleQuizClick = (quizId) => {
  // Store quizId in localStorage
  localStorage.setItem("quizId", quizId);

  console.log(`Navigating to /quiz/${quizId}`);
  navigate(`/quiz/${quizId}`);  // Navigate to quiz start page
};


  return (
    <div>
      <h2>Available Quizzes</h2>

      {/* Show loading state */}
      {isLoading && <p>Loading quizzes...</p>}

      {/* Show error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Show quizzes if available */}
      {quizzes.length > 0 ? (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="quiz-card"
              onClick={() => handleQuizClick(quiz.id)}
            >
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p>Questions Count: {quiz.questions.length}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No quizzes available at the moment.</p>
      )}
    </div>
  );
};

export default Quizzes;
