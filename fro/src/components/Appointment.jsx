import React, { useEffect, useState } from 'react';
import apiAxios from '../api/apiAxios';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ PatientID: '', DoctorCode: '', AppointmentDate: '', Diagnosis: '', Treatment: '', Status: 'Scheduled' });

    const reloadData = async () => {
        const [a, p, d] = await Promise.all([
            apiAxios.get('/appointments'),
            apiAxios.get('/patients'),
            apiAxios.get('/doctors')
        ]);
        setAppointments(a.data);
        setPatients(p.data);
        setDoctors(d.data);
    };

    useEffect(() => { reloadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await apiAxios.put(`/appointments/${editingId}`, form);
            setEditingId(null);
        } else {
            await apiAxios.post('/appointments', form);
        }
        setForm({ PatientID: '', DoctorCode: '', AppointmentDate: '', Diagnosis: '', Treatment: '', Status: 'Scheduled' });
        reloadData();
    };

    const handleEdit = (app) => {
        setEditingId(app.AppointmentID);
        // Clean ISO string for input conversion
        let dateVal = app.AppointmentDate ? new Date(app.AppointmentDate).toISOString().slice(0, 16) : '';
        setForm({ ...app, AppointmentDate: dateVal });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl h-fit">
                    <h2 className="text-xl font-bold mb-4 text-emerald-400">{editingId ? 'Modify Session' : 'Schedule Case'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.PatientID} onChange={e => setForm({...form, PatientID: e.target.value})}>
                            <option value="">-- Choose Target Patient --</option>
                            {patients.map(p => <option key={p.PatientID} value={p.PatientID}>{p.FirstName} {p.LastName}</option>)}
                        </select>
                        <select required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.DoctorCode} onChange={e => setForm({...form, DoctorCode: e.target.value})}>
                            <option value="">-- Assign Doctor Staff --</option>
                            {doctors.map(d => <option key={d.DoctorCode} value={d.DoctorCode}>{d.DoctorName}</option>)}
                        </select>
                        <input type="datetime-local" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.AppointmentDate} onChange={e => setForm({...form, AppointmentDate: e.target.value})} />
                        <textarea placeholder="Clinical Diagnosis" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Diagnosis} onChange={e => setForm({...form, Diagnosis: e.target.value})} />
                        <textarea placeholder="Prescribed Regimen Treatment" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Treatment} onChange={e => setForm({...form, Treatment: e.target.value})} />
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white" value={form.Status} onChange={e => setForm({...form, Status: e.target.value})}>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition-all">Submit Entry</button>
                    </form>
                </div>
                <div className="lg:col-span-2 overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-slate-200">Consultation Schedule Log</h2>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="p-3">Patient</th>
                                <th className="p-3">Doctor</th>
                                <th className="p-3">Date/Time</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.AppointmentID} className="border-b border-slate-800 hover:bg-slate-800/40">
                                    <td className="p-3 font-medium">{a.PatientName}</td>
                                    <td className="p-3 text-slate-300">{a.DoctorName}</td>
                                    <td className="p-3 text-slate-300 font-mono text-xs">{new Date(a.AppointmentDate).toLocaleString()}</td>
                                    <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${a.Status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : a.Status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{a.Status}</span></td>
                                    <td className="p-3 text-right"><button onClick={() => handleEdit(a)} className="text-cyan-400 hover:underline text-xs">Manage</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Appointment;