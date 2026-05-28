import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import apiAxios from '../api/apiAxios';

const ProtectedRouter = () => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        apiAxios.get('/auth/session')
            .then(res => setAuth(res.data.authenticated))
            .catch(() => setAuth(false));
    }, []);

    if (auth === null) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-semibold">Verifying Secure Session...</div>;

    return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRouter;