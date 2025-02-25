// HomeRedirect.jsx
import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const HomeRedirect = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // If not authenticated, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.toLowerCase() === "admin") {
    return <Navigate to="/dashboard" replace />;
  } else if (user.toLowerCase() === "user") {
    return <Navigate to="/userdashboard" replace />;
  }

  // Fallback in case the role doesn't match
  return <Navigate to="/unauthorized" replace />;
};

export default HomeRedirect;
