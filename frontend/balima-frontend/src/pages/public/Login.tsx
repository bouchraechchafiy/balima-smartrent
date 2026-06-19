import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
            login(res.data);
            if (res.data.role === 'manager') navigate('/manager');
            else if (res.data.role === 'tenant') navigate('/tenant');
            else if (res.data.role === 'technician') navigate('/technician');
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- UPDATED DEMO CREDENTIALS ---
    const fillDemo = (roleEmail: string) => {
        setEmail(roleEmail);
        setPassword('123'); // Password matches seed_data.py
        setError('');
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 animate-fade-in">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Please enter your details to access your portal.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-100">
                                <AlertCircle size={16} />{error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input type="email" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-900 outline-none transition bg-slate-50"
                                   placeholder="name@balima.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input type="password" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-900 outline-none transition bg-slate-50"
                                   placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 group disabled:opacity-70">
                            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : <><ArrowRight size={18} className="group-hover:translate-x-1 transition" /> Sign In</>}
                        </button>
                    </form>

                    {/* --- UPDATED BUTTONS --- */}
                    <div className="mt-10 pt-10 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Demo Quick Links (Autofill)</p>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => fillDemo('admin@balima.com')}
                                className="px-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-900 transition"
                            >
                                Manager
                            </button>
                            <button
                                onClick={() => fillDemo('Samir@balima.com')}
                                className="px-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-900 transition"
                            >
                                Tenant
                            </button>
                            <button
                                onClick={() => fillDemo('youssef@balima.com')}
                                className="px-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-900 transition"
                            >
                                Tech
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: IMAGE */}
            <div className="hidden lg:block w-1/2 bg-slate-900 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop" alt="Luxury Building" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute bottom-0 left-0 p-24 text-white z-10">
                    <h2 className="text-4xl font-bold mb-4">Smart Living, <br/>Redefined.</h2>
                    <p className="text-slate-300 text-lg max-w-md">"Balima SmartRent has completely transformed how we manage our properties. The AI integration is seamless."</p>
                </div>
            </div>
        </div>
    )
}