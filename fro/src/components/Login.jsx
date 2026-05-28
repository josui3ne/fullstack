import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiAxios from '../api/apiAxios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiAxios.post('/auth/login', { email, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm text-center mb-6">Hospital Information Access Terminal</p>
                {error && <div className="bg-rose-500/10 text-rose-400 text-sm p-3 rounded-lg border border-rose-500/20 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-500/20">Sign In</button>
                </form>
                <p className="text-center text-sm text-slate-400 mt-6">New system user? <Link to="/register" className="text-emerald-400 hover:underline">Create Account</Link></p>
            </div>
        </div>
    );
};

export default Login;