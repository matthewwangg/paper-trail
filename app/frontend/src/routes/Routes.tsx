import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignUpPage';
import ProtectedRoute from "./ProtectedRoutes";
import NotesPage from "../pages/NotesPage";
import TasksPage from "../pages/TasksPage";

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route
                    path="/notes"
                    element={
                        <ProtectedRoute>
                            <NotesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <TasksPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
