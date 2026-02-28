// src/services/api.js
import axios from "axios";

// ------------------- BASE CONFIG -------------------
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ------------------- REQUEST INTERCEPTOR -------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------- RESPONSE INTERCEPTOR -------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ------------------- AUTH API -------------------
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ------------------- PROJECT API -------------------
export const projectAPI = {
  getAll: () => api.get("/projects"),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ------------------- EXPENSE API -------------------
// export const expenseAPI = {
//   getAll: (projectId) =>
//     api.get("/expenses", { params: { project_id: projectId } }).then((res) => res.data),
//   create: (data) => api.post("/expenses", data).then((res) => res.data),
//   delete: (id) => api.delete(`/expenses/${id}`).then((res) => res.data),
// };
export const expenseAPI = {
  // Matches your SQL: get by project_id
  getAll: (projectId) => api.get(`/expenses/project/${projectId}`),
  // Matches your SQL: needs title, amount, category, project_id
  create: (data) => api.post('/expenses', data),
  delete: (id) => api.delete(`/expenses/${id}`)
};

// ------------------- TASK API -------------------
export const taskAPI = {
  getAll: () => api.get("/tasks"),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// ------------------- CONTRACTOR API -------------------
export const contractorAPI = {
  getAll: () => api.get("/contractors"),
  create: (data) => api.post("/contractors", data),
  update: (id, data) => api.put(`/contractors/${id}`, data),
  delete: (id) => api.delete(`/contractors/${id}`),
};

// Export default axios instance if needed
export default api;