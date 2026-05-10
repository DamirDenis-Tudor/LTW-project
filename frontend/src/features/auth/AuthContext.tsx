import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '../../types';

interface CognitoJwtPayload {
    sub: string;
    'cognito:username'?: string;
    'cognito:groups'?: string[];
    username?: string;
    role?: UserRole;
    email?: string;
    exp: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    }, []);

    const login = useCallback((newToken: string) => {
        try {
            const decoded = jwtDecode<CognitoJwtPayload>(newToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                logout();
                return;
            }

            localStorage.setItem('auth_token', newToken);
            setToken(newToken);

            // Handle both Cognito and local JWT formats
            const username = decoded['cognito:username'] || decoded.username || '';
            const groups = decoded['cognito:groups'] || [];
            const role = decoded.role || groups.find(g => Object.values(UserRole).includes(g as UserRole)) as UserRole || UserRole.Partner;

            setUser({
                id: decoded.sub,
                username,
                role,
                email: decoded.email || '',
            });
        } catch (error) {
            console.error('Invalid token:', error);
            logout();
        }
    }, [logout]);

    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            login(storedToken);
        }
        setIsLoading(false);
    }, [login]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
