import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Clock, AlertCircle, Trash2, RefreshCw,
    CheckCircle2, Wrench, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TechDash() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper boolean to make logic cleaner
    const isManager = user?.role === 'manager';
    const isTech = user?.role === 'technician';

    // 1. Fetch Jobs
    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/technician/jobs');
            setJobs(res.data);
        } catch (e) { console.error("Could not fetch jobs"); }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, []);

    // 2. Move Job Logic
    const moveJob = async (id: number, newStatus: string) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
        await axios.post('http://127.0.0.1:8000/api/technician/update-status', { id, status: newStatus });
    };

    // 3. Delete All Logic (Manager Only)
    const handleDeleteAll = async () => {
        if (!confirm("⚠️ ARE YOU SURE? This deletes ALL work orders.")) return;
        setIsDeleting(true);
        try {
            await axios.delete('http://127.0.0.1:8000/api/maintenance/all', { data: { role: user?.role } });
            setJobs([]);
            alert("All orders deleted.");
        } catch (e) { alert("Access Denied."); } finally { setIsDeleting(false); }
    };

    return (
        <div className="min-h-screen flex flex-col pb-12">

            {/* HEADER */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Work Orders</h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
                        Live Operations Board
                    </p>
                </div>

                {/* MANAGER ACTIONS */}
                {isManager && (
                    <div className="flex gap-2">
                        <button onClick={fetchJobs} className="p-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm">
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            disabled={isDeleting || jobs.length === 0}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 font-bold text-sm rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm disabled:opacity-50"
                        >
                            <Trash2 size={18} /> {isDeleting ? 'Clearing...' : 'Clear All Orders'}
                        </button>
                    </div>
                )}
            </div>

            {/* KANBAN BOARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                <Column title="To Do" count={jobs.filter(j => j.status === 'To Do').length} color="bg-slate-100/50 border border-slate-200" icon={<AlertCircle size={16} className="text-slate-500"/>}>
                    {jobs.filter(j => j.status === 'To Do').map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            // FIX: Only pass onMove if the user is a technician
                            onMove={isTech ? () => moveJob(job.id, 'In Progress') : undefined}
                        />
                    ))}
                </Column>

                <Column title="In Progress" count={jobs.filter(j => j.status === 'In Progress').length} color="bg-blue-50/50 border border-blue-100" icon={<Wrench size={16} className="text-blue-500"/>}>
                    {jobs.filter(j => j.status === 'In Progress').map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            active
                            // FIX: Only pass onMove if the user is a technician
                            onMove={isTech ? () => moveJob(job.id, 'Completed') : undefined}
                        />
                    ))}
                </Column>

                <Column title="Completed" count={jobs.filter(j => j.status === 'Completed').length} color="bg-emerald-50/50 border border-emerald-100" icon={<CheckCircle2 size={16} className="text-emerald-500"/>}>
                    {jobs.filter(j => j.status === 'Completed').map((job) => (
                        <JobCard key={job.id} job={job} done />
                    ))}
                </Column>

            </div>
        </div>
    )
}

// --- HELPER COMPONENTS ---

function Column({ title, count, color, icon, children }: any) {
    return (
        <div className={`flex flex-col rounded-xl ${color} p-4 h-fit min-h-[200px]`}>
            <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="font-bold text-slate-700">{title}</h3>
                </div>
                <span className="bg-white px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-600 shadow-sm border border-slate-100">{count}</span>
            </div>
            <div className="space-y-3">
                {children}
                {children.length === 0 && <div className="h-24 border-2 border-dashed border-slate-300/30 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">No tickets</div>}
            </div>
        </div>
    )
}

function JobCard({ job, active, done, onMove }: any) {
    return (
        <motion.div
            layoutId={String(job.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 ${done ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md'}`}
        >
            <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
            job.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                job.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'
        }`}>{job.priority}</span>
                <span className="text-[10px] text-slate-400 font-mono">#{job.id}</span>
            </div>

            <h4 className="font-bold text-slate-900 mb-1">{job.category} Issue</h4>
            <p className="text-sm text-slate-500 mb-4">{job.description}</p>

            <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100 flex gap-2 items-start">
                <AlertTriangle size={14} className="mt-0.5 text-yellow-600 shrink-0"/>
                <span className="text-xs text-slate-600 font-medium line-clamp-2">{job.ai_analysis}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 border-t border-slate-50 pt-3">
                <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.unit_number}</div>
                <div className="flex items-center gap-1.5"><Clock size={14} /> {job.created_at?.split(' ')[0] || 'Today'}</div>
            </div>

            {/* ONLY RENDER IF onMove IS PASSED (i.e., Only for Techs) */}
            {onMove && (
                <button onClick={onMove} className="w-full mt-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition shadow-sm flex items-center justify-center gap-2">
                    {active ? <><CheckCircle2 size={14}/> Mark Complete</> : <><Wrench size={14}/> Start Job</>}
                </button>
            )}
        </motion.div>
    )
}