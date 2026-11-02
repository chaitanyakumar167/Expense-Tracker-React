import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If there is no token, redirect to the login page immediately.
  // The 'replace' prop ensures they can't click the browser 'back' button 
  // to return to the protected route after being redirected.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a token exists, render the protected component (e.g., Dashboard)
  return children;
}