import { useState } from 'react';
import { Palette, X } from 'lucide-react';

export default function ThemeDevTool() {
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { name: 'Royal (Default)', class: '' },
        { name: 'Silicon Valley', class: 'theme-modern' },
        { name: 'Oasis Nature', class: 'theme-nature' },
        { name: 'Corporate Blue', class: 'theme-corp' },
    ];

    const changeTheme = (themeClass: string) => {
        // Remove all theme classes first
        document.body.classList.remove('theme-modern', 'theme-nature', 'theme-corp');
        // Add the selected one (if not default)
        if (themeClass) document.body.classList.add(themeClass);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 bg-white border border-slate-200 rounded-full shadow-xl hover:scale-110 transition text-slate-600"
                >
                    <Palette size={24} />
                </button>
            ) : (
                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 w-64 animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-xs uppercase text-slate-400">Theme Engine</h3>
                        <button onClick={() => setIsOpen(false)}><X size={16}/></button>
                    </div>
                    <div className="space-y-2">
                        {themes.map((t) => (
                            <button
                                key={t.name}
                                onClick={() => changeTheme(t.class)}
                                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition border border-transparent hover:border-slate-200"
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}