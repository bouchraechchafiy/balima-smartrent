import { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    role: 'manager' | 'tenant' | 'technician';
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // FIX: Lazy Initialization.
    // We read localStorage inside useState so 'user' is ready on the very first render.
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('balima_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('balima_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('balima_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);