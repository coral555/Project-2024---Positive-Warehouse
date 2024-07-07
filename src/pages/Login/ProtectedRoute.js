import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, element }) => {
  return isAuthenticated ? element : <Navigate to="/LoginPage" />;
};

export default ProtectedRoute;
