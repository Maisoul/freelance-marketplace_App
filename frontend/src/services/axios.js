import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy set in vite.config.js
});

export default api;
