import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    // Remove extra slashes but keep the ones after protocol
    url = url.replace(/([^:]\/)\/+/g, "$1");
    // Remove trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // 1. Normalize baseURL (no trailing slash)
    if (config.baseURL && config.baseURL.endsWith('/')) {
        config.baseURL = config.baseURL.slice(0, -1);
    }

    // 2. Normalize url (must start with exactly one slash)
    // If it's already an absolute URL, leave it alone
    if (config.url && !config.url.startsWith('http')) {
        if (!config.url.startsWith('/')) {
            config.url = '/' + config.url;
        }
        // Remove double slashes if any (except protocol)
        config.url = config.url.replace(/\/+/g, '/');
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
