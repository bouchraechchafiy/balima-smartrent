import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Bell, Search, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function DashboardLayout() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState<any[]>([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // 1. Click Outside Logic (Closes dropdown when clicking elsewhere)
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 2. Poll for Notifications
    useEffect(() => {
        if (!user) return;
        const fetchNotifs = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/notifications/${user.role}`);
                setNotifs(res.data.items || []);
            } catch (e) { console.error("Error fetching notifications"); }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 5000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col h-screen relative">

                {/* HEADER - Increased Z-Index to 40 so it sits above the page content */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0 shadow-sm">

                    <div className="flex items-center gap-4 text-slate-400 bg-slate-50 px-4 py-2 rounded-lg w-96 border border-slate-100 focus-within:border-slate-300 transition">
                        <Search size={18} />
                        <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full text-sm text-slate-700"/>
                    </div>

                    {/* NOTIFICATION WRAPPER */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            className={`p-2 rounded-full relative transition duration-200 ${
                                showNotifs ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            <Bell size={20} />
                            {notifs.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>

                        {/* DROPDOWN - Z-50 Ensures it floats on top */}
                        <AnimatePresence>
                            {showNotifs && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden ring-1 ring-black/5"
                                >
                                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                        <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600">
                                            <X size={16}/>
                                        </button>
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto">
                                        {notifs.length === 0 ? (
                                            <div className="p-8 text-center flex flex-col items-center gap-2 text-slate-400">
                                                <Check size={24} className="text-emerald-500 opacity-50"/>
                                                <p className="text-sm">All caught up!</p>
                                            </div>
                                        ) : (
                                            notifs.map((n) => (
                                                <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer group">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">{n.title}</p>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {notifs.length > 0 && (
                                        <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                                            <button className="text-xs font-medium text-blue-600 hover:text-blue-800">Mark all read</button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto z-0 relative">
                    <PageTransition> {/* <--- WRAP HERE */}
                        <Outlet />
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}