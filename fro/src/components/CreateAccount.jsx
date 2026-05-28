import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiAxios from '../api/apiAxios';

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErr(''); setMsg('');
        try {
            await apiAxios.post('/auth/register', { username, email, password });
            setMsg('Account provisioned successfully! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setErr(error.response?.data?.message || 'Registration dropped.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-white mb-2">System Provisioning</h2>
                <p className="text-slate-400 text-sm text-center mb-6">Create administrative credentials</p>
                {err && <div className="bg-rose-500/10 text-rose-400 text-sm p-3 rounded-lg border border-rose-500/20 mb-4">{err}</div>}
                {msg && <div className="bg-emerald-500/10 text-emerald-400 text-sm p-3 rounded-lg border border-emerald-500/20 mb-4">{msg}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                        <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-500/20">Register</button>
                </form>
                <p className="text-center text-sm text-slate-400 mt-6">Already provisioned? <Link to="/login" className="text-emerald-400 hover:underline">Log In</Link></p>
            </div>
        </div>
    );
};

export default CreateAccount;