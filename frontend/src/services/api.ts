import axios from 'axios';

const api = axios.create({
  baseURL: 'https://baggy-dab-tabloid.ngrok-free.dev',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// --- Auth ---
export const authApi = {
  register: (data: { nama: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// --- Kategori ---
export const kategoriApi = {
  getAll: () => api.get('/kategori'),
  getById: (id: number) => api.get(`/kategori/${id}`),
  create: (data: { nama: string; deskripsi?: string }) =>
    api.post('/kategori', data),
  update: (id: number, data: { nama?: string; deskripsi?: string }) =>
    api.put(`/kategori/${id}`, data),
  delete: (id: number) => api.delete(`/kategori/${id}`),
};

// --- Menu ---
export const menuApi = {
  getAll: (params?: { kategoriId?: number; tersedia?: boolean; search?: string }) =>
    api.get('/menu', { params }),
  getById: (id: number) => api.get(`/menu/${id}`),
  create: (data: any) => api.post('/menu', data),
  update: (id: number, data: any) => api.put(`/menu/${id}`, data),
  toggle: (id: number) => api.patch(`/menu/${id}/toggle`),
  delete: (id: number) => api.delete(`/menu/${id}`),
};

// --- Pesanan ---
export const pesananApi = {
  getAll: (status?: string) => api.get('/pesanan', { params: { status } }),
  getMine: () => api.get('/pesanan/saya'),
  getById: (id: number) => api.get(`/pesanan/${id}`),
  create: (data: any) => api.post('/pesanan', data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/pesanan/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/pesanan/${id}`),
};
