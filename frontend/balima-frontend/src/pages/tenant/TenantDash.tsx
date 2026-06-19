import { useState, useEffect } from 'react';
import {
    CreditCard, Wrench, MessageSquare, FileText, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TenantDash() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<any[]>([]);

    // FETCH REAL REQUESTS
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/tenant/requests');
                setRequests(res.data);
            } catch (e) { console.error("Error fetching requests"); }
        };
        fetchRequests();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome home, Sarah.</h1>
                    <p className="text-slate-500 mt-1">Unit 4B • Balima Luxury Residences</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
          <CheckCircle2 size={14} />
          Lease Active
        </span>
            </div>

            {/* HERO SECTION */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg group">
                <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop"
                    alt="My Apartment"
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-white text-2xl font-bold">The Skyline Suite</h2>
                    <p className="text-slate-200">Lease ending in 142 days</p>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction icon={<Wrench size={24} />} label="Request Fix" desc="Plumbing, Electric..." onClick={() => navigate('/tenant/request')} primary />
                <QuickAction icon={<CreditCard size={24} />} label="Pay Rent" desc="Next due: Dec 1st" onClick={() => {}} />
                <QuickAction icon={<MessageSquare size={24} />} label="Concierge" desc="Chat with Manager" onClick={() => navigate('/manager/chat')} />
                <QuickAction icon={<FileText size={24} />} label="Lease Docs" desc="View Contract" onClick={() => {}} />
            </div>

            {/* STATUS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Payment Status (Static for now) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={20} /></div>
                        <h3 className="font-semibold text-slate-900">Billing</h3>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-slate-400 text-sm">Amount Due</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">$0.00</p>
                        <p className="text-emerald-600 text-sm font-medium mt-2 flex justify-center items-center gap-1">
                            <CheckCircle2 size={14} /> All paid up
                        </p>
                    </div>
                </div>

                {/* Maintenance Status (REAL DATA) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Wrench size={20} /></div>
                            <h3 className="font-semibold text-slate-900">Recent Requests</h3>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {requests.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-4">No active requests.</p>
                        ) : (
                            requests.map((req: any) => (
                                <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${
                                            req.status === 'Completed' ? 'bg-emerald-500' :
                                                req.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300'
                                        }`}></div>
                                        <div>
                                            <p className="font-medium text-slate-900">{req.category}</p>
                                            <p className="text-xs text-slate-500">{req.description.substring(0, 40)}...</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                        req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            req.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-white text-slate-600 border-slate-200'
                                    }`}>
                            {req.status}
                        </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

function QuickAction({ icon, label, desc, onClick, primary }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 ${
                primary
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-100 hover:shadow-md'
            }`}
        >
            <div className="mb-4 opacity-90">{icon}</div>
            <p className="font-bold text-lg">{label}</p>
            <p className={`text-sm mt-1 ${primary ? 'text-slate-300' : 'text-slate-500'}`}>{desc}</p>
        </button>
    )
}