// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, userType } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    // Redirect to unauthorized page or handle accordingly
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
