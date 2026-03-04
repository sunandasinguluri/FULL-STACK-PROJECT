import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '@/lib/mockData';
import type { User, Role } from '@/lib/mockData';

interface AuthContextType {
    user: User | null;
    role: Role | null;
    login: (email: string, role: Role) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('cv_user');
        const savedRole = localStorage.getItem('cv_role') as Role;

        if (savedUser && savedRole) {
            setUser(JSON.parse(savedUser));
            setRole(savedRole);
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: Role) => {
        // Fake login: find user in mock data or create one
        const existingUser = MOCK_USERS.find(u => u.email === email && u.role === role);

        const userData: User = existingUser || {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email: email,
            role: role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        setUser(userData);
        setRole(role);
        localStorage.setItem('cv_user', JSON.stringify(userData));
        localStorage.setItem('cv_role', role);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('cv_user');
        localStorage.removeItem('cv_role');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
