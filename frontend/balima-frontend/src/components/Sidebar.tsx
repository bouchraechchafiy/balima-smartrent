import { Link, useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore
// @ts-ignore
import {
    LayoutDashboard, Users, Wrench, FileText,
    MessageSquare, LogOut, Home, Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (!user) return null;

    const isActive = (path: string) => location.pathname === path;

    const NavItem = ({ to, icon, label }: any) => {
        const active = isActive(to);
        return (
            <Link to={to} className="relative group block mb-2">
                {/* Active Glow Indicator */}
                {active && (
                    <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-r-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                    />
                )}

                <div className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
          ${active
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 hover:pl-5'
                }`}>

          <span className={`relative z-10 ${active ? 'text-yellow-600' : 'text-slate-500 group-hover:text-slate-300'}`}>
            {icon}
          </span>
                    <span className="relative z-10">{label}</span>
                </div>
            </Link>
        );
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    bg-slate-900
    return (

        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0 shadow-2xl z-30">

            {/* HEADER */}
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Balima<span className="text-yellow-600">.</span>
                </h1>
                <div className="flex items-center gap-2 mt-2 px-2 py-1 bg-slate-800 rounded-md w-fit">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">{user.role} View</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">

                {/* MANAGER MENU */}
                {user.role === 'manager' && (
                    <div className="animate-fade-in">
                        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Management</p>

                        <NavItem to="/manager" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                        <NavItem to="/manager/properties" icon={<Building size={18} />} label="Properties & AI" />

                        {/* NEW LINK ADDED HERE */}
                        <NavItem to="/technician" icon={<Wrench size={18} />} label="Work Orders" />

                        <NavItem to="/manager/chat" icon={<MessageSquare size={18} />} label="Team Chat" />
                    </div>
                )}

                {/* TENANT MENU */}
                {user.role === 'tenant' && (
                    <div className="animate-fade-in">
                        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">My Residence</p>
                        <NavItem to="/tenant" icon={<Home size={18} />} label="Home Overview" />
                        <NavItem to="/tenant/request" icon={<FileText size={18} />} label="Maintenance" />
                        <NavItem to="/manager/chat" icon={<MessageSquare size={18} />} label="Concierge Chat" />
                    </div>
                )}

                {/* TECHNICIAN MENU */}
                {user.role === 'technician' && (
                    <div className="animate-fade-in">
                        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Operations</p>
                        <NavItem to="/technician" icon={<Wrench size={18} />} label="Work Orders" />
                        <NavItem to="/manager/chat" icon={<MessageSquare size={18} />} label="Dispatch Chat" />
                    </div>
                )}

            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <div className="flex items-center gap-3 mb-4 px-2 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                        {user.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize truncate">{user.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium px-3 transition hover:bg-white/5 py-2 rounded-lg">
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}