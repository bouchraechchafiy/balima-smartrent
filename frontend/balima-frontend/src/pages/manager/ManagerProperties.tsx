import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Loader2, Building2, UserCheck, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ManagerProperties() {
    const [apartments, setApartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Occupied, Vacant
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/apartments');
                setApartments(res.data);
            } catch (e) { console.error("Error fetching properties"); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    // Filter Logic
    const filtered = apartments.filter(apt => {
        const matchesFilter = filter === 'All' ? true : apt.status === filter;
        const matchesSearch = apt.code.toLowerCase().includes(search.toLowerCase()) ||
            apt.type.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 min-h-screen">

            {/* HEADER & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="text-slate-400"/> Property Inventory
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Managing {apartments.length} total units across 4 wings.</p>
                </div>

                <div className="flex gap-4 items-center w-full md:w-auto">
                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['All', 'Occupied', 'Vacant'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
                                    filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search unit..."
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900 w-full md:w-64 transition"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={32}/></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-slate-50/50 text-xs uppercase text-slate-400 font-bold tracking-wider sticky top-0 backdrop-blur-sm z-10">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-100">Unit</th>
                                <th className="px-6 py-4 border-b border-slate-100">Status</th>
                                <th className="px-6 py-4 border-b border-slate-100 text-right">Rent</th>
                                <th className="px-6 py-4 border-b border-slate-100 w-48">Turnover Risk</th>
                                <th className="px-6 py-4 border-b border-slate-100">AI Model</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {filtered.map((apt, i) => (
                                <motion.tr
                                    key={apt.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="hover:bg-blue-50/30 transition duration-200 group cursor-default"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Tiny Image Preview */}
                                            <img src={apt.image_url} className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-110 transition" alt="unit" />
                                            <div>
                                                <p className="font-bold text-slate-900">{apt.code}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{apt.type.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                apt.status === 'Occupied'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                                {apt.status === 'Occupied' ? <UserCheck size={12}/> : <AlertCircle size={12}/>}
                                {apt.status}
                            </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{apt.price.toLocaleString()} MAD</td>

                                    {/* Risk Bar */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${apt.vacancy_risk > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${apt.vacancy_risk}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-bold ${apt.vacancy_risk > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {apt.vacancy_risk}%
                                </span>
                                        </div>
                                    </td>

                                    {/* AI Price Diff */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-slate-600">{apt.ai_suggested_price.toLocaleString()}</span>
                                            {apt.ai_suggested_price > apt.price ? (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded flex items-center font-bold">
                                        <TrendingUp size={10} className="mr-1"/> +{((apt.ai_suggested_price - apt.price)/apt.price * 100).toFixed(0)}%
                                    </span>
                                            ) : apt.ai_suggested_price < apt.price ? (
                                                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex items-center font-bold">
                                        <TrendingDown size={10} className="mr-1"/> -{((apt.price - apt.ai_suggested_price)/apt.price * 100).toFixed(0)}%
                                    </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 font-medium">Optimal</span>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}