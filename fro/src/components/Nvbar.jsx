import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiAxios from '../api/apiAxios';

const Nvbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await apiAxios.post('/auth/logout');
            navigate('/login');
        } catch (err) {
            console.error("Logout failed");
        }
    };

    const links = [
        { name: 'Dashboard', path: '/' },
        { name: 'Patients', path: '/patients' },
        { name: 'Doctors', path: '/doctors' },
        { name: 'Appointments', path: '/appointments' },
        { name: 'Reports', path: '/reports' }
    ];

    return (
        <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-emerald-400 tracking-wider">🫀 HMS_CORE</span>
                    </div>
                    <div className="hidden md:flex space-x-4">
                        {links.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === link.path ? 'bg-emerald-500 text-slate-900 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div>
                        <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition-all transform active:scale-95">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nvbar;