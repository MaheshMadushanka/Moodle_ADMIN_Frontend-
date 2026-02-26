import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  // not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // logged in
  return children;
}

export default ProtectedRoute;