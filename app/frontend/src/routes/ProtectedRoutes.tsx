import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // Validate the token's expiration here

    return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
