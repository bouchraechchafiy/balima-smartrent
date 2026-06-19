import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Trash2, Hash, Shield, Activity, User, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Poll Messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/messages');
                setMessages(res.data);
            } catch (e) { console.error("Chat Offline"); }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send Message
    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post('http://127.0.0.1:8000/api/messages', {
                role: user?.role,
                name: user?.name,
                content: newMessage
            });
            setNewMessage('');
            // Optimistic UI update
            setMessages([...messages, {
                id: Date.now(),
                sender_name: user?.name,
                sender_role: user?.role,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }]);
        } catch (e) { alert("Failed to send"); }
    };

    // Clear Chat (Manager Only)
    const handleClear = async () => {
        if (!confirm("Are you sure you want to clear the entire team history?")) return;
        try {
            await axios.delete('http://127.0.0.1:8000/api/messages', { data: { role: user?.role } });
            setMessages([]);
        } catch (e) { alert("Access Denied: Only Managers can clear chat."); }
    };

    // Helper for Avatar Colors
    const getRoleColor = (role: string) => {
        if (role === 'manager') return 'bg-slate-900 text-white';
        if (role === 'technician') return 'bg-blue-600 text-white';
        return 'bg-emerald-500 text-white';
    };

    const getRoleIcon = (role: string) => {
        if (role === 'manager') return <Shield size={12} />;
        if (role === 'technician') return <Wrench size={12} />;
        return <User size={12} />;
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {/* PRO HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
                        <Hash size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            Internal Ops & Data
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">Real-time maintenance & leasing coordination</p>
                    </div>
                </div>

                {/* Manager Actions */}
                {user?.role === 'manager' && (
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                        <Trash2 size={14} /> Clear Channel
                    </button>
                )}
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">

                {/* Empty State / System Message */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                        <Activity size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">Secure Channel Established</p>
                        <p className="text-xs text-slate-400 mt-1">Encrypted communication for Balima Staff & Residents</p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => {
                        const isMe = msg.sender_name === user?.name;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-sm font-bold ${getRoleColor(msg.sender_role)}`}>
                                    {msg.sender_name.charAt(0)}
                                </div>

                                <div className={`flex flex-col max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    {/* Name Label */}
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        {!isMe && (
                                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                        {msg.sender_name}
                                                {/* Role Badge */}
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider flex items-center gap-1 ${
                                                    msg.sender_role === 'manager' ? 'bg-slate-100 text-slate-600' :
                                                        msg.sender_role === 'technician' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                            {getRoleIcon(msg.sender_role)} {msg.sender_role}
                                        </span>
                                    </span>
                                        )}
                                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        isMe
                                            ? 'bg-slate-900 text-white rounded-tr-sm'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={bottomRef}></div>
            </div>

            {/* INPUT AREA */}
            <div className="p-5 bg-white border-t border-slate-100">
                <div className="flex items-center gap-3 relative">
                    <input
                        type="text"
                        className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-xl px-5 py-3.5 text-sm outline-none transition placeholder:text-slate-400 font-medium"
                        placeholder={`Message as ${user?.name}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="p-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition hover:scale-105 active:scale-95 shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 px-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    System operational. All messages logged for quality assurance.
                </p>
            </div>
        </div>
    )
}