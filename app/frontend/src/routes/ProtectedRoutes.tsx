import React, {JSX} from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp: number;
}

interface ProtectedRouteProps {
    children: JSX.Element;
}

const isTokenValid = (token: string): boolean => {
    try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const { exp } = decodedToken;

        return exp * 1000 > Date.now();
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token && isTokenValid(token)) {
        return children;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
