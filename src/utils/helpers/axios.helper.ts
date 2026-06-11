// services/api.service.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log("📤 Суроо:", config.method, config.url);

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("📥 Жооп:", response.status, response.config.url);
    // Успешный ответ
    return response.data;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default api;
