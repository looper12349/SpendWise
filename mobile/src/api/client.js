import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your backend URL
const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/update', data)
};

// Expenses API
export const expensesAPI = {
    getAll: (params) => api.get('/expenses', { params }),
    getOne: (id) => api.get(`/expenses/${id}`),
    create: (data) => api.post('/expenses', data),
    update: (id, data) => api.put(`/expenses/${id}`, data),
    delete: (id) => api.delete(`/expenses/${id}`)
};

// Budgets API
export const budgetsAPI = {
    getAll: () => api.get('/budgets'),
    getCurrent: () => api.get('/budgets/current'),
    create: (data) => api.post('/budgets', data),
    delete: (id) => api.delete(`/budgets/${id}`)
};

// Wallets API
export const walletsAPI = {
    getAll: () => api.get('/wallets'),
    getOne: (id) => api.get(`/wallets/${id}`),
    create: (data) => api.post('/wallets', data),
    addMember: (id, email) => api.post(`/wallets/${id}/members`, { email }),
    addExpense: (id, data) => api.post(`/wallets/${id}/expenses`, data),
    settleSplit: (walletId, splitId, userId) =>
        api.put(`/wallets/${walletId}/settle/${splitId}/${userId}`),
    delete: (id) => api.delete(`/wallets/${id}`)
};

// Analytics API
export const analyticsAPI = {
    getOverview: () => api.get('/analytics/overview'),
    getByCategory: (params) => api.get('/analytics/by-category', { params }),
    getMonthlyTrend: (params) => api.get('/analytics/monthly-trend', { params }),
    getDaily: () => api.get('/analytics/daily')
};

export default api;
