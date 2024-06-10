// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
