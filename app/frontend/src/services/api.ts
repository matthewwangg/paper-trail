import axios from 'axios';

const API_URL = 'http://localhost:8080';

const instance = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
