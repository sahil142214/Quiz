import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import QuizScreen from "./components/QuizScreen";
import QuizArchive from "./components/QuizArchive";
import Quizzes from "./components/Quizzes";

const AppRoutes = () => {
  const navigate = useNavigate();

  // // Check if user is logged in and redirect accordingly
  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   if (accessToken) {
  //     navigate("/quizzes");
  //   }
  // }, [navigate]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return <Login />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz_archive"
        element={
          <ProtectedRoute>
            <QuizArchive />
          </ProtectedRoute>
        }
      />
      <Route path="/quiz/:quizId" element={<QuizScreen />} />
      <Route path="/" element={<Login />} /> {/* Default route */}
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
