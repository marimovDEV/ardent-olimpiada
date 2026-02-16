import axios from "axios";

export const API_URL = "https://api.hogwords.uz/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token
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

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If token is invalid or expired (401/403), clear it and redirect
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Avoid infinite redirect if already on login page
            const path = window.location.pathname;
            if (path.includes('/auth/login') || path.includes('/teacher/login') || path.includes('/admin/login')) {
                return Promise.reject(error);
            }

            // Role-based redirect logic
            if (path.startsWith('/teacher')) {
                window.location.href = '/teacher/login';
            } else if (path.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    const headers: any = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export default api;
