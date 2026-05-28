import React, { useEffect, useState } from 'react';
import apiAxios from '../api/apiAxios';

const Dashboard = () => {
    const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });

    useEffect(() => {
        const fetchTelemetry = async () => {
            try {
                const [p, d, a] = await Promise.all([
                    apiAxios.get('/patients'),
                    apiAxios.get('/doctors'),
                    apiAxios.get('/appointments')
                ]);
                setCounts({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length });
            } catch (err) {
                console.error("Telemetry collection crashed", err);
            }
        };
        fetchTelemetry();
    }, []);

    const layout = [
        { title: 'Total Registered Patients', value: counts.patients, color: 'border-l-4 border-cyan-500', icon: '👥' },
        { title: 'Active Medical Staff', value: counts.doctors, color: 'border-l-4 border-emerald-500', icon: '🥼' },
        { title: 'Booked Consultations', value: counts.appointments, color: 'border-l-4 border-amber-500', icon: '📅' }
    ];

    return (
        <div className="min-h-[calc(min-screen-16)] bg-slate-950 p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Command Center Dashboard</h1>
                <p className="text-slate-400 mb-8 text-sm">Real-time status updates of active operations.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {layout.map((card, idx) => (
                        <div key={idx} className={`bg-slate-900 rounded-xl p-6 ${card.color} shadow-xl border border-slate-800 flex items-center justify-between`}>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{card.title}</h3>
                                <p className="text-4xl font-black mt-2 text-white">{card.value}</p>
                            </div>
                            <span className="text-4xl">{card.icon}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;