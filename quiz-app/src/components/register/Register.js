import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios"; // Import the custom Axios instance
import './Register.css'; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("api/register/", {
        username,
        password,
      });
      console.log(response);

      alert("Registration successful! Please log in.");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
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
          <button type="submit">Register</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Register;
