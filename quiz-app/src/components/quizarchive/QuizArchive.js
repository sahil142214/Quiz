import React, { useState, useEffect } from "react";
import api from "../../utils/axios";  // Import the custom Axios instance
import './QuizArchive.css'; // Import the CSS for styling

const QuizArchive = () => {
  const [attempts, setAttempts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Fetch quiz archive data when component mounts
  useEffect(() => {
    const fetchQuizArchive = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setErrorMessage("You must be logged in to view your quiz archive.");
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/api/quiz_archive/${username}/`);  // Use the custom api instance
        setAttempts(response.data);
      } catch (error) {
        setErrorMessage("Failed to load quiz archive.");
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    fetchQuizArchive();
  }, []);

  // Format date to a readable format
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="quiz-archive">
      <h2>Quiz Archive</h2>

      {/* Show loading state */}
      {isLoading && <div className="loading-spinner">Loading...</div>}

      {/* Show error message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Show attempts if available */}
      {attempts.length > 0 ? (
        <div className="quiz-archive-list">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="quiz-archive-card">
              <h3>{attempt.quiz.title}</h3>
              <p>Score: {attempt.score}</p>
              <p>Attempted on: {formatDate(attempt.attempt_time)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't taken any quizzes yet.</p>
      )}
    </div>
  );
};

export default QuizArchive;
