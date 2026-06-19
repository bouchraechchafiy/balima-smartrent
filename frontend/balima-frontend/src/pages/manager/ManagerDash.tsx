import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    AlertCircle,
    TrendingUp,
    BrainCircuit,
    MoreHorizontal,
    X,
    Sparkles,
    Send,
    Bot,
    User,
    Zap,
    BarChart3,
    ShieldAlert
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// --- TYPES ---
interface DashboardStats {
    occupancy_rate: number;
    active_leases: number;
    pending_requests: number;
    monthly_revenue: number;
}

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

// --- HELPER: FORMAT AI TEXT ---
const renderFormattedText = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    return cleanText.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2"></div>;
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.replace(/^[\*\-]\s/, '');
            return (
                <div key={i} className="flex gap-2 mb-1 ml-1">
                    <span className="text-purple-500 mt-1.5">•</span>
                    <span className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseBold(content) }} />
                </div>
            );
        }
        return <p key={i} className="mb-2 text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseBold(trimmed) }} />;
    });
};

const parseBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>');
}

export default function ManagerDash() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // --- AI ASSISTANT STATE ---
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
    const [aiQuery, setAiQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, aiLoading]);

    // Fetch Stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Backend offline");
                setStats({ occupancy_rate: 88, active_leases: 42, pending_requests: 3, monthly_revenue: 115000 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle Question
    const handleAskAi = async (overrideQuery?: string) => {
        const queryToSend = overrideQuery || aiQuery;
        if (!queryToSend.trim()) return;

        const userMsg = queryToSend;

        // Grab Last Context
        const lastAiMsg = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "";

        setAiQuery('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setAiLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/ai/ask', {
                question: userMsg,
                previous_answer: lastAiMsg
            });
            setChatHistory(prev => [...prev, { role: 'ai', content: res.data.answer }]);
        } catch (e) {
            setChatHistory(prev => [...prev, { role: 'ai', content: "Network error. Please ensure the backend is running." }]);
        } finally {
            setAiLoading(false);
        }
    };

    const revenueData = [
        { name: 'Jan', revenue: 95000 }, { name: 'Feb', revenue: 102000 },
        { name: 'Mar', revenue: 98000 }, { name: 'Apr', revenue: 115000 },
        { name: 'May', revenue: 125000 }, { name: 'Jun', revenue: 125000 },
    ];

    if (loading) return <div className="p-10 text-slate-400">Loading Dashboard...</div>;

    return (
        <motion.div className="space-y-8 relative" variants={containerVariants} initial="hidden" animate="visible">

            {/* HEADER */}
            <motion.div variants={itemVariants} className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h2>
                    <p className="text-slate-500 mt-1">Real-time performance metrics for Balima Residences.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition">Download Report</button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 transition">+ Add Unit</button>
                </div>
            </motion.div>

            {/* KPI GRID */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Monthly Revenue" value={stats ? `$${stats.monthly_revenue.toLocaleString()}` : "..."} trend="+12.5%" trendUp={true} icon={<TrendingUp size={20} className="text-emerald-600" />} />
                <StatCard title="Occupancy Rate" value={stats ? `${stats.occupancy_rate}%` : "..."} trend="+2.1%" trendUp={true} />
                <StatCard title="Active Leases" value={stats ? stats.active_leases : "..."} trend="Stable" trendUp={true} />
                <StatCard title="Pending Requests" value={stats ? stats.pending_requests : "..."} trend="Action Needed" trendUp={false} isAlert />
            </motion.div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* REVENUE CHART */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    {/* GOLD GRADIENT */}
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3}/> {/* Yellow-600 */}
                                        <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{color: '#fff'}}
                                    cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                                />

                                {/* Use the Gradient ID here */}
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#ca8a04"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* AI INSIGHTS CARD */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <BrainCircuit size={20} className="text-yellow-600" /> Gemini AI
                        </h3>
                        <span className="flex h-3 w-3 relative">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                    </div>
                    <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                        <InsightItem color="bg-blue-500" title="Vacancy Risk: Unit 4B" desc="Lease expires in 15 days. Market analysis suggests increasing rent by 5%." />
                        <InsightItem color="bg-amber-500" title="Maintenance Anomaly" desc="Plumbing requests up 20%. Recommended: Inspect main valve." />
                        <InsightItem color="bg-emerald-500" title="Positive Cashflow" desc="Net Operating Income (NOI) trending above Q3 projections." />
                    </div>
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                        <button onClick={() => setIsAiOpen(true)} className="w-full py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-medium rounded-lg text-sm hover:shadow-lg hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                            <Sparkles size={16} className="text-yellow-400" /> Ask AI Assistant
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* --- PRO AI COMMAND CENTER MODAL --- */}
            <AnimatePresence>
                {isAiOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                        >
                            {/* Modal Header */}
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                        <Sparkles size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Data Intelligence</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <p className="text-xs text-slate-500 font-medium">Gemini • Connected</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition hover:text-slate-600">
                                    <X size={20}/>
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                                {chatHistory.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{animationFillMode: 'forwards'}}>
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
                                            <Bot size={32} className="text-slate-300" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">How can I help you?</h4>
                                        <p className="text-slate-500 max-w-xs mb-8">Analyze trends, predict risks, or draft tenant communications.</p>

                                        {/* Quick Actions Grid */}
                                        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                                            <QuickPrompt icon={<BarChart3 size={16}/>} label="Analyze Revenue" onClick={() => handleAskAi("Analyze current revenue trends")} />
                                            <QuickPrompt icon={<ShieldAlert size={16}/>} label="Assess Risk" onClick={() => handleAskAi("What are the current vacancy risks?")} />
                                            <QuickPrompt icon={<Zap size={16}/>} label="Optimization" onClick={() => handleAskAi("How can we optimize operations?")} />
                                            <QuickPrompt icon={<MoreHorizontal size={16}/>} label="Market Summary" onClick={() => handleAskAi("Summarize the current market position")} />
                                        </div>
                                    </div>
                                )}

                                {chatHistory.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                                            msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-yellow-600 border border-slate-100'
                                        }`}>
                                            {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                        </div>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user'
                                                ? 'bg-slate-900 text-white rounded-tr-sm'
                                                : 'bg-white border border-slate-100 rounded-tl-sm text-slate-700'
                                        }`}>
                                            {msg.role === 'ai' ? renderFormattedText(msg.content) : msg.content}
                                        </div>
                                    </motion.div>
                                ))}

                                {aiLoading && (
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white text-yellow-600 border border-slate-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                            <Sparkles size={14} />
                                        </div>
                                        <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 h-12">
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Floating Input Area */}
                            <div className="p-5 bg-white border-t border-slate-100">
                                <div className="relative flex items-center shadow-sm rounded-xl bg-slate-50 border border-slate-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all duration-300">
                                    <input
                                        className="flex-1 bg-transparent px-4 py-3.5 text-sm outline-none text-slate-800 placeholder:text-slate-400"
                                        placeholder="Ask a question about your property..."
                                        value={aiQuery}
                                        onChange={(e) => setAiQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleAskAi()}
                                        disabled={aiLoading || !aiQuery.trim()}
                                        className="mr-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-slate-400 mt-2">AI can make mistakes. Please verify important data.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

// --- HELPER COMPONENTS ---
function QuickPrompt({ icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all text-left shadow-sm">
            {icon}
            {label}
        </button>
    )
}

function StatCard({ title, value, trend, trendUp, isAlert, icon }: any) {
    return (
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
                {icon}
            </div>
            <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
                <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${isAlert ? 'bg-red-50 border-red-100 text-red-600' : trendUp ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                    {isAlert && <AlertCircle size={12} className="mr-1.5" />}
                    {trendUp && <ArrowUpRight size={12} className="mr-1.5" />}
                    {trend}
                </div>
            </div>
        </motion.div>
    );
}

function InsightItem({ color, title, desc }: any) {
    return (
        <div className="flex gap-3 items-start p-3 rounded-lg hover:bg-slate-50 transition cursor-pointer group border border-transparent hover:border-slate-100">
            <div className={`w-2 h-2 rounded-full ${color} mt-2 shrink-0 group-hover:scale-125 transition`}></div>
            <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}