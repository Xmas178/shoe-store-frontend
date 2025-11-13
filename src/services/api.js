import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Shoe store API:n osoite

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Lisää token automaattisesti pyyntöihin jos se on olemassa
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;