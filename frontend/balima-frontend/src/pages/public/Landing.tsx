import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Smartphone, Building2 } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tight cursor-pointer">
                        Balima<span className="text-yellow-600">.</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <Link to="/residences" className="hover:text-slate-900 transition">Residences</Link>
                        <a href="#amenities" className="hover:text-slate-900 transition">Amenities</a>
                        <a href="#contact" className="hover:text-slate-900 transition">Contact</a>
                    </div>
                    <Link to="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                        Resident Portal
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                            Living, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">Reimagined.</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-xl">
                            Experience the future of property management with Balima SmartRent.
                            AI-driven service, instant maintenance, and seamless living in the heart of Rabat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* --- LINKED TO CATALOG --- */}
                            <Link
                                to="/residences"
                                className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/20"
                            >
                                View Available Units
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                            </Link>

                            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-medium hover:bg-slate-50 transition">
                                Book a Tour
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 flex items-center gap-6 text-sm text-slate-400 font-medium">
                            <span className="flex items-center gap-2"><Building2 size={16}/> Historic Architecture</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-2"><Sparkles size={16}/> Smart Interiors</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image Blob */}
                <div className="absolute top-0 right-0 w-[45%] h-full hidden lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover rounded-bl-[100px] shadow-2xl"
                        alt="Luxury Interior"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent"></div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section id="amenities" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Smart Living Ecosystem</h2>
                        <p className="text-slate-500">We use advanced AI to ensure your home is always perfect. From predictive maintenance to instant concierge services.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Sparkles size={24} className="text-yellow-600" />}
                            title="AI Concierge"
                            desc="Our Gemini-powered assistant is available 24/7 to answer lease questions and handle requests instantly."
                        />
                        <FeatureCard
                            icon={<Smartphone size={24} className="text-blue-600" />}
                            title="Digital First"
                            desc="Pay rent, sign documents, and book amenities entirely from your phone. No paperwork, ever."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={24} className="text-emerald-600" />}
                            title="Secure & Safe"
                            desc="Advanced security monitoring and instant alerts keep you and your family safe around the clock."
                        />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contact" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="text-2xl font-bold text-white tracking-tight mb-2">Balima<span className="text-yellow-600">.</span></div>
                        <p className="text-sm text-slate-500">Avenue Mohammed V, Rabat, Morocco</p>
                    </div>
                    <div className="text-sm font-medium flex gap-6">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Support</a>
                    </div>
                    <p className="text-sm">© 2025 Balima Residences.</p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
    )
}