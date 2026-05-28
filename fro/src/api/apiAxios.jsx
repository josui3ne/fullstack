import axios from 'axios';

const apiAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Crucial for express-session storage
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiAxios;