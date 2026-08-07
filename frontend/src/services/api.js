import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Workflow APIs
export const workflowAPI = {
  create: (data) => api.post("/workflows", data),
  getAll: () => api.get("/workflows"),
  getById: (id) => api.get(`/workflows/${id}`),
  update: (id, data) => api.put(`/workflows/${id}`, data),
  delete: (id) => api.delete(`/workflows/${id}`),
};

// Workflow Step APIs
export const workflowStepAPI = {
  add: (workflowId, data) => api.post(`/workflows/${workflowId}/steps`, data),
  getAll: (workflowId) => api.get(`/workflows/${workflowId}/steps`),
  getById: (stepId) => api.get(`/workflows/steps/${stepId}`),
  update: (stepId, data) => api.put(`/workflows/steps/${stepId}`, data),
  delete: (stepId) => api.delete(`/workflows/steps/${stepId}`),
};

// Execution APIs
export const executionAPI = {
  run: (workflowId, data) => api.post(`/executions/run/${workflowId}`, data),
  getAll: () => api.get("/executions"),
  getById: (id) => api.get(`/executions/${id}`),
};

export default api;