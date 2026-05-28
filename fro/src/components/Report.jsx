import React, { useEffect, useState } from 'react';
import apiAxios from '../api/apiAxios';

const Report = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        apiAxios.get('/appointments').then(res => setAppointments(res.data));
    }, []);

    const printSystemReport = () => { window.print(); };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-8 print:bg-white print:text-black">
            <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl print:border-none print:shadow-none print:bg-transparent">
                <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white print:text-black">Clinical Evaluation Report</h1>
                        <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleString()}</p>
                    </div>
                    <button onClick={printSystemReport} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all shadow print:hidden">
                        Print Report
                    </button>
                </div>
                <div className="space-y-6">
                    {appointments.filter(a => a.Diagnosis || a.Treatment).map(a => (
                        <div key={a.AppointmentID} className="bg-slate-950 p-4 rounded-lg border border-slate-800 print:border-black print:bg-transparent">
                            <div className="flex justify-between text-xs text-slate-400 font-mono mb-2 print:text-neutral-700">
                                <span>Patient: {a.PatientName}</span>
                                <span>Physician: {a.DoctorName}</span>
                            </div>
                            <div className="mb-2">
                                <span className="text-xs font-semibold uppercase text-amber-400 tracking-wider">Diagnosis</span>
                                <p className="text-sm mt-0.5 text-slate-200 print:text-black">{a.Diagnosis || 'No diagnosis logged'}</p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">Treatment Scheme</span>
                                <p className="text-sm mt-0.5 text-slate-200 print:text-black">{a.Treatment || 'No regimen specified'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Report;