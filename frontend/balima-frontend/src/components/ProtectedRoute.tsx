import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {JSX} from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: string[]; // e.g. ['manager']
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user } = useAuth();

    // 1. Not Logged In? -> Go to Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Wrong Role? -> Go to their specific home
    if (!allowedRoles.includes(user.role)) {
        if (user.role === 'manager') return <Navigate to="/manager" />;
        if (user.role === 'tenant') return <Navigate to="/tenant" />;
        if (user.role === 'technician') return <Navigate to="/technician" />;
        return <Navigate to="/" />;
    }

    // 3. Allowed? -> Render Page
    return children;
}