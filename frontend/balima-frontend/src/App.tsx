import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/public/Landing';
import Listings from './pages/public/Listings';
import Login from './pages/public/Login';
import ManagerDash from './pages/manager/ManagerDash';
import ManagerProperties from './pages/manager/ManagerProperties';
import TenantDash from './pages/tenant/TenantDash';
import NewRequest from './pages/tenant/NewRequest';
import TechDash from './pages/tech/TechDash';
import Chat from './pages/shared/Chat';

function App() {
    return (
        <BrowserRouter>
            {/* Toast Notifications */}
            <Toaster position="top-center" richColors />

            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Landing />} />
                <Route path="/residences" element={<Listings />} />
                <Route path="/login" element={<Login />} />

                {/* PROTECTED ROUTES */}
                <Route element={<DashboardLayout />}>

                    {/* MANAGER ONLY */}
                    <Route path="/manager" element={
                        <ProtectedRoute allowedRoles={['manager']}>
                            <ManagerDash />
                        </ProtectedRoute>
                    } />
                    <Route path="/manager/properties" element={
                        <ProtectedRoute allowedRoles={['manager']}>
                            <ManagerProperties />
                        </ProtectedRoute>
                    } />

                    {/* TENANT ONLY */}
                    <Route path="/tenant" element={
                        <ProtectedRoute allowedRoles={['tenant']}>
                            <TenantDash />
                        </ProtectedRoute>
                    } />
                    <Route path="/tenant/request" element={
                        <ProtectedRoute allowedRoles={['tenant']}>
                            <NewRequest />
                        </ProtectedRoute>
                    } />

                    {/* TECHNICIAN (Shared with Manager) */}
                    <Route path="/technician" element={
                        <ProtectedRoute allowedRoles={['technician', 'manager']}>
                            <TechDash />
                        </ProtectedRoute>
                    } />

                    {/* CHAT (Shared) */}
                    <Route path="/manager/chat" element={
                        <ProtectedRoute allowedRoles={['manager', 'tenant', 'technician']}>
                            <Chat />
                        </ProtectedRoute>
                    } />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;