import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make API request to authenticate
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if response contains access and refresh tokens
      if (response.data.access && response.data.refresh) {
        // Store tokens in localStorage
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("username", username);
        // Navigate to quizzes page
        navigate("/quizzes");
      } else {
        // Tokens missing in the response
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle errors from the API call
      if (error.response) {
        setErrorMessage(error.response.data.detail || "Something went wrong.");
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
