import React, { useState, useEffect } from "react";
import QuizArchive from "../quizarchive/QuizArchive";  // Import QuizArchive to display user's attempted quizzes
import api from "../../utils/axios";  // Import axios instance
import './Profile.css';  // Import the CSS file

const Profile = () => {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Get the logged-in user's info
    const fetchProfileData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setErrorMessage("You must be logged in to view your profile.");
          return;
        }
        setUsername(username); // Set the username from local storage
      } catch (error) {
        setErrorMessage("Failed to load user profile.");
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-container">
      <h2 className="profile-header">User Profile</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="username-section">
        <p><strong>Username:</strong> {username}</p>
      </div>

      {/* Display quiz archive for this user */}
      <h3 className="quiz-attempts-header">Your Quiz Attempts</h3>
      <div className="quiz-archive">
        <QuizArchive />  {/* Reusing the QuizArchive component to show user's quiz attempts */}
      </div>
    </div>
  );
};

export default Profile;
