import React, { useEffect, useState } from 'react';
import apiAxios from '../api/apiAxios';

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({ FirstName: '', LastName: '', Gender: 'Male', Telephone: '', Address: '', RegistrationDate: '' });
    const [editingId, setEditingId] = useState(null);

    const getPatients = async () => {
        const res = await apiAxios.get('/patients');
        setPatients(res.data);
    };

    useEffect(() => { getPatients(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await apiAxios.put(`/patients/${editingId}`, form);
            setEditingId(null);
        } else {
            await apiAxios.post('/patients', form);
        }
        setForm({ FirstName: '', LastName: '', Gender: 'Male', Telephone: '', Address: '', RegistrationDate: '' });
        getPatients();
    };

    const handleEdit = (p) => {
        setEditingId(p.PatientID);
        setForm({ ...p, RegistrationDate: p.RegistrationDate.split('T')[0] });
    };

    const handleDelete = async (id) => {
        if (confirm("Purge patient registry record?")) {
            await apiAxios.delete(`/patients/${id}`);
            getPatients();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel Form */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl h-fit">
                    <h2 className="text-xl font-bold mb-4 text-emerald-400">{editingId ? 'Modify Record' : 'Enroll New Patient'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="First Name" required className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.FirstName} onChange={e => setForm({...form, FirstName: e.target.value})} />
                            <input type="text" placeholder="Last Name" required className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.LastName} onChange={e => setForm({...form, LastName: e.target.value})} />
                        </div>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Gender} onChange={e => setForm({...form, Gender: e.target.value})}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <input type="text" placeholder="Telephone" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Telephone} onChange={e => setForm({...form, Telephone: e.target.value})} />
                        <textarea placeholder="Address" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Address} onChange={e => setForm({...form, Address: e.target.value})} />
                        <input type="date" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.RegistrationDate} onChange={e => setForm({...form, RegistrationDate: e.target.value})} />
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition-all">{editingId ? 'Push Update' : 'Commit Record'}</button>
                    </form>
                </div>
                {/* Data Matrix Grid */}
                <div className="lg:col-span-2 overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-slate-200">Patient Database Matrix</h2>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(p => (
                                <tr key={p.PatientID} className="border-b border-slate-800 hover:bg-slate-800/40">
                                    <td className="p-3 font-mono text-emerald-400">#{p.PatientID}</td>
                                    <td className="p-3 font-medium">{p.FirstName} {p.LastName}</td>
                                    <td className="p-3 text-slate-300">{p.Gender}</td>
                                    <td className="p-3 text-slate-300">{p.Telephone}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button onClick={() => handleEdit(p)} className="text-cyan-400 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(p.PatientID)} className="text-rose-400 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patient;