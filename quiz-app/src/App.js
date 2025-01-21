import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import QuizScreen from "./components/quizscreen/QuizScreen";
import QuizArchive from "./components/quizarchive/QuizArchive";
import Quizzes from "./components/quizzes/Quizzes";
import Profile from "./components/Profile/Profile";  // Import the Profile component

const AppRoutes = () => {
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
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
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
