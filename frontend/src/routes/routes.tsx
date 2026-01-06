import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import { UserRole } from '../types';

// Placeholder components for features
const Dashboard = () => <div>Dashboard (Coming soon)</div>;
const ProjectList = () => <div>Project List (Coming soon)</div>;
const ProjectDetail = () => <div>Project Detail (Coming soon)</div>;
const UserList = () => <div>User List (Coming soon)</div>;
const OrganizationList = () => <div>Organization List (Coming soon)</div>;

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />

                <Route path="projects">
                    <Route index element={<ProjectList />} />
                    <Route path=":id" element={<ProjectDetail />} />
                </Route>

                <Route
                    path="users"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                            <UserList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="organizations"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                            <OrganizationList />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
