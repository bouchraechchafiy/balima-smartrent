import { useState, useEffect } from 'react';
import { MapPin, Home, Maximize, ArrowRight, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Listings() {
    const [apartments, setApartments] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApts = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/apartments');
                // Filter only 'Vacant' for public view
                const vacant = res.data.filter((a: any) => a.status === 'Vacant');
                setApartments(vacant);
                setFiltered(vacant);
            } catch (e) {
                console.error("Error loading listings");
            } finally {
                setLoading(false);
            }
        };
        fetchApts();
    }, []);

    // Filter Logic
    useEffect(() => {
        if (filterType === 'All') {
            setFiltered(apartments);
        } else if (filterType === 'Studios') {
            setFiltered(apartments.filter(a => a.size < 60));
        } else if (filterType === 'Suites') {
            setFiltered(apartments.filter(a => a.size >= 60 && a.size < 120));
        } else if (filterType === 'Penthouses') {
            setFiltered(apartments.filter(a => a.size >= 120));
        }
    }, [filterType, apartments]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* LUXURY NAVBAR */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-200/60 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-tight cursor-pointer font-serif">
                        Balima<span className="text-yellow-600">.</span>
                    </Link>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
                        <Link to="/" className="hover:text-slate-900 transition">Concierge</Link>
                        <Link to="/" className="hover:text-slate-900 transition">History</Link>
                    </div>
                    <button onClick={() => navigate('/login')} className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                        Resident Portal
                    </button>
                </div>
            </nav>

            {/* HEADER SECTION */}
            <div className="pt-40 pb-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-8"
                    >
                        <div className="max-w-2xl">
                            <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-4">Curated Collection</h4>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 font-serif">
                                Live in History. <br/>
                                <span className="text-slate-400">Defined by Luxury.</span>
                            </h1>
                            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                                Modernized suites in the heart of Rabat's Avenue Mohammed V.
                                Experience the perfect blend of Art Deco heritage and smart living technology.
                            </p>
                        </div>

                        {/* FILTER PILLS */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['All', 'Studios', 'Suites', 'Penthouses'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilterType(f)}
                                    className={`px-6 py-3 rounded-full text-sm font-bold transition whitespace-nowrap ${
                                        filterType === f
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* LISTINGS GRID */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="flex justify-center p-32"><Loader2 className="animate-spin text-slate-300" size={48} /></div>
                ) : (
                    <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filtered.map((apt) => (
                                <motion.div
                                    layout
                                    key={apt.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500 border border-slate-100"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <img src={apt.image_url} alt={apt.type} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                        <div className="absolute top-6 left-6 flex gap-2">
                            <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                {apt.code}
                            </span>
                                        </div>
                                        <div className="absolute bottom-6 right-6">
                            <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                {apt.price.toLocaleString()} MAD <span className="opacity-70 font-normal">/mo</span>
                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">{apt.type}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <MapPin size={14} className="text-yellow-600"/> {apt.address}
                                            </div>
                                        </div>

                                        <div className="flex gap-6 border-t border-slate-100 pt-6 mb-8">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Size</span>
                                                <span className="text-slate-900 font-medium flex items-center gap-1"><Maximize size={14}/> {apt.size} m²</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status</span>
                                                <span className="text-emerald-600 font-medium flex items-center gap-1"><Home size={14}/> Available</span>
                                            </div>
                                        </div>

                                        <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                            Schedule Viewing <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}