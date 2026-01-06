import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, UserRole, JwtPayload } from '../../types';

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
            const decoded = jwtDecode<JwtPayload>(newToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                logout();
                return;
            }

            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            setUser({
                id: decoded.sub,
                username: decoded.username,
                role: decoded.role,
                email: '', // Email might not be in JWT, will be fetched if needed or added to JWT
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
