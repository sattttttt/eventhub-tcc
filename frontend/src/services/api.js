import axios from 'axios';

// Buat instance axios dengan baseURL dari backend kita
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Ini bagian yang sangat berguna: Axios Interceptor
// Kode ini akan otomatis menambahkan header Authorization ke setiap request
// jika kita sudah memiliki token yang tersimpan di localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;