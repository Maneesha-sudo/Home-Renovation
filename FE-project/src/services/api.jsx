import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ------------------- REQUEST INTERCEPTOR -------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------- RESPONSE INTERCEPTOR -------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ------------------- AUTH API -------------------
// ------------------- AUTH API -------------------
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  me: () => api.get("/api/auth/me"),
};

// ------------------- PROJECT API -------------------
export const projectAPI = {
  getAll: () => api.get('/api/projects'),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// ------------------- EXPENSE API -------------------
export const expenseAPI = {
  getAll: (projectId) =>
    api.get('/api/expenses', { params: { project_id: projectId } }),
  create: (data) => api.post('/api/expenses', data),
  delete: (id) => api.delete(`/api/expenses/${id}`),
};

// ------------------- TASK API -------------------
export const taskAPI = {
  getAll: () => api.get('/api/tasks'),
  create: (data) => api.post('/api/tasks', data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/tasks/${id}`),
};

// ------------------- CONTRACTOR API -------------------
export const contractorAPI = {
  getAll: () => api.get('/api/contractors'),
  create: (data) => api.post('/api/contractors', data),
  update: (id, data) => api.put(`/api/contractors/${id}`, data),
  delete: (id) => api.delete(`/api/contractors/${id}`),
};

export default api;