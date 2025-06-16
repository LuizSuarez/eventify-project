

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromStorage } from '../utils/auth';

const PrivateRoute = ({ children, roles }) => {
  const { token, user } = getUserFromStorage();

  if (!token || !user) {
    // not logged in
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(user.role)) {
    // role not allowed
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default PrivateRoute;


