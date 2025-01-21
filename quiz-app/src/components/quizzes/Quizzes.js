// src/components/Quizzes.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";  // Import the Navbar component
import './Quizzes.css';  // Import the CSS file

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    localStorage.setItem("quizId", quizId);
    navigate(`/quiz/${quizId}`);  // Navigate to quiz start page
  };

  return (
    <div>
      <Navbar />  {/* Add the Navbar component here */}
      <div className="quizzes-container">
        <h2>Available Quizzes</h2>

        {isLoading && <p>Loading quizzes...</p>}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

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
    </div>
  );
};

export default Quizzes;
