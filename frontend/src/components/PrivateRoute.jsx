import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token, redirect to welcome/login page
  if (!token) return <Navigate to="/" replace />;

  // Else render the component
  return children;
}
