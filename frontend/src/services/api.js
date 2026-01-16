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
    // Axios joins baseURL and url. If the url starts with a slash, it treats it as absolute to the domain.
    // If our baseURL ends with /api, we usually want calls to be relative to that.
    if (config.url && config.url.startsWith('/') && config.baseURL && config.baseURL.endsWith('/api')) {
        config.url = config.url.substring(1);
    }
    return config;
});

// Interceptor to add Clerk token will be managed in AuthContext or App components
// because it requires access to the Clerk hooks.

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
