import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextValue extends AuthState {
    isAuthenticated: boolean;
    login: (username: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL = 'https://dummyjson.com/auth/login';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');

        if (savedToken && savedUser) {
            setState({ user: JSON.parse(savedUser), token: savedToken, isLoading: false, error: null });
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (username: string, password: string, rememberMe: boolean) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) throw new Error('Invalid credentials');
            const data = await response.json();
            const { accessToken: token, id, username: apiUsername, email, firstName, lastName } = data;
            const user = { id, username: apiUsername, email, firstName, lastName };
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('auth_token', token);
            storage.setItem('auth_user', JSON.stringify(user));
            setState({ user, token, isLoading: false, error: null });
            return { success: true };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        setState({ user: null, token: null, isLoading: false, error: null });
    };

    return (
        <AuthContext.Provider value={{ ...state, isAuthenticated: !!state.token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
