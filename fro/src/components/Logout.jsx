import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAxios from '../api/apiAxios';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        apiAxios.post('/auth/logout').finally(() => navigate('/login'));
    }, [navigate]);
    return null;
};

export default Logout;