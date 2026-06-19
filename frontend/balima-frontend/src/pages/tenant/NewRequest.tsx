import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Upload,
    AlertCircle,
    Wand2,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NewRequest() {
    const navigate = useNavigate();
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('General');

    // UI States
    const [analyzing, setAnalyzing] = useState(false); // Visual effect only
    const [isSubmitting, setIsSubmitting] = useState(false); // Real loading state

    // 1. Handle Typing (Visual AI Effect)
    const handleType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setDesc(text);

        // Simulate AI "Thinking" visual when typing stops
        if (text.length > 5) {
            setAnalyzing(true);
            const timer = setTimeout(() => setAnalyzing(false), 1500);
            return () => clearTimeout(timer);
        }
    };

    // 2. Handle Real Submission to Backend
    const handleSubmit = async () => {
        if (!desc.trim()) return;

        setIsSubmitting(true);

        try {
            // Send data to our FastAPI + Gemini Backend
            await axios.post('http://127.0.0.1:8000/api/submit-request', {
                description: desc
                // We don't send category/priority because AI decides that!
            });

            // Success Animation/Redirect
            navigate('/tenant'); // Go back to dashboard to see the new card

        } catch (error) {
            console.error("Submission failed:", error);
            alert("System Error: Could not reach the AI Manager. Is the backend running?");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto pb-12"
        >
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">New Maintenance Request</h1>
                <p className="text-slate-500 mt-1">Describe the issue. Our AI will analyze urgency and assign a technician.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">

                {/* SECTION 1: MANUAL CATEGORY (Optional Override) */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Issue Context (Optional)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Plumbing', 'Electrical', 'Appliance', 'General'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                                    category === cat
                                        ? 'border-slate-900 bg-slate-900 text-white'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: DESCRIPTION + AI BADGE */}
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={6}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-0 outline-none transition resize-none bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        placeholder="e.g. The water heater is making a loud hissing noise and there is a smell of gas..."
                        value={desc}
                        onChange={handleType}
                    />

                    {/* AI ANIMATIONS OVERLAY */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {analyzing && (
                            <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 bg-purple-50 px-3 py-1.5 rounded-full animate-pulse border border-purple-100">
                                <Wand2 size={12} />
                                AI Analyzing...
                            </div>
                        )}
                        {!analyzing && desc.length > 15 && (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <CheckCircle2 size={12} />
                                Details Captured
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 3: PHOTO UPLOAD (Visual Demo) */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Photos / Video</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-slate-900 hover:bg-slate-50 transition cursor-pointer group">
                        <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-white transition group-hover:scale-110">
                            <Camera size={24} className="text-slate-500 group-hover:text-slate-900" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Click to upload or drag & drop</p>
                        <p className="text-xs text-slate-400 mt-1">JPG, PNG or MP4 (Max 10MB)</p>
                    </div>
                </div>

                {/* SECTION 4: SUBMIT ACTION */}
                <div className="pt-4 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <AlertCircle size={14} />
                        <span>Submitting implies consent to enter unit for repairs.</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !desc}
                        className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                            isSubmitting || !desc
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Wand2 size={18} className="animate-spin" />
                                AI Processing...
                            </>
                        ) : (
                            <>
                                Submit Request
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </motion.div>
    )
}