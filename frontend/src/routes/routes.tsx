import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../features/dashboard/DashboardPage';
import ProjectListPage from '../features/projects/ProjectListPage';
import ProjectCreatePage from '../features/projects/ProjectCreatePage';
import ProjectDetailsPage from '../features/projects/ProjectDetailsPage';
import WorkPackageDetailsPage from '../features/projects/WorkPackageDetailsPage';
import WorkPackageCreatePage from '../features/projects/WorkPackageCreatePage';
import OrganizationListPage from '../features/organizations/OrganizationListPage';
import OrganizationCreatePage from '../features/organizations/OrganizationCreatePage';
import UserListPage from '../features/users/UserListPage';
import UserCreatePage from '../features/users/UserCreatePage';
import { UserRole } from '../types';

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
                <Route index element={<DashboardPage />} />

                <Route path="projects">
                    <Route index element={<ProjectListPage />} />
                    <Route path="new" element={
                        <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Manager]}>
                            <ProjectCreatePage />
                        </ProtectedRoute>
                    } />
                    <Route path=":id" element={<ProjectDetailsPage />} />
                </Route>

                <Route path="work-packages/:id" element={<WorkPackageDetailsPage />} />
                <Route path="projects/:projectId/work-packages/new" element={
                    <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Manager]}>
                        <WorkPackageCreatePage />
                    </ProtectedRoute>
                } />

                <Route path="users" element={
                    <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <UserListPage />
                    </ProtectedRoute>
                } />
                <Route path="users/new" element={
                    <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <UserCreatePage />
                    </ProtectedRoute>
                } />

                <Route path="organizations" element={
                    <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <OrganizationListPage />
                    </ProtectedRoute>
                } />
                <Route path="organizations/new" element={
                    <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <OrganizationCreatePage />
                    </ProtectedRoute>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
