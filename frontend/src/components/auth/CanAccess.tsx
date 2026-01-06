import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';

interface CanAccessProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
}

/**
 * A utility component to conditionally render children based on user role.
 */
const CanAccess: React.FC<CanAccessProps> = ({
    children,
    allowedRoles,
    fallback = null,
}) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <>{fallback}</>;
    }

    if (!allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default CanAccess;
