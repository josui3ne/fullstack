import React, { useEffect, useState } from 'react';
import apiAxios from '../api/apiAxios';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ DoctorCode: '', DoctorName: '', Specialization: '', Telephone: '', Email: '', HireDate: '' });
    const [isEdit, setIsEdit] = useState(false);

    const getDoctors = async () => {
        const res = await apiAxios.get('/doctors');
        setDoctors(res.data);
    };

    useEffect(() => { getDoctors(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            await apiAxios.put(`/doctors/${form.DoctorCode}`, form);
            setIsEdit(false);
        } else {
            await apiAxios.post('/doctors', form);
        }
        setForm({ DoctorCode: '', DoctorName: '', Specialization: '', Telephone: '', Email: '', HireDate: '' });
        getDoctors();
    };

    const handleEdit = (d) => {
        setIsEdit(true);
        setForm({ ...d, HireDate: d.HireDate.split('T')[0] });
    };

    const handleDelete = async (code) => {
        if(confirm("Expunge doctor record?")) {
            await apiAxios.delete(`/doctors/${code}`);
            getDoctors();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl h-fit">
                    <h2 className="text-xl font-bold mb-4 text-emerald-400">{isEdit ? 'Modify Practitioner' : 'Onboard Physician'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Doctor Code (e.g., DOC01)" required disabled={isEdit} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white disabled:opacity-50" value={form.DoctorCode} onChange={e => setForm({...form, DoctorCode: e.target.value})} />
                        <input type="text" placeholder="Full Name" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.DoctorName} onChange={e => setForm({...form, DoctorName: e.target.value})} />
                        <input type="text" placeholder="Specialization" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Specialization} onChange={e => setForm({...form, Specialization: e.target.value})} />
                        <input type="text" placeholder="Telephone" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Telephone} onChange={e => setForm({...form, Telephone: e.target.value})} />
                        <input type="email" placeholder="Email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Email} onChange={e => setForm({...form, Email: e.target.value})} />
                        <input type="date" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.HireDate} onChange={e => setForm({...form, HireDate: e.target.value})} />
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition-all">{isEdit ? 'Save Structural Changes' : 'Authorize Provisioning'}</button>
                    </form>
                </div>
                <div className="lg:col-span-2 overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-slate-200">Staffing Matrix</h2>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="p-3">Code</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Department</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(d => (
                                <tr key={d.DoctorCode} className="border-b border-slate-800 hover:bg-slate-800/40">
                                    <td className="p-3 font-mono text-emerald-400">{d.DoctorCode}</td>
                                    <td className="p-3 font-medium">{d.DoctorName}</td>
                                    <td className="p-3 text-slate-300">{d.Specialization}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button onClick={() => handleEdit(d)} className="text-cyan-400 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(d.DoctorCode)} className="text-rose-400 hover:underline">Delete</button>
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

export default Doctor;