import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getBrands = async () => {
  const { data } = await api.get('/api/brands');
  return data;
};
export const createBrand = async (brandData) => {
  const { data } = await api.post('/api/brands', brandData);
  return data;
};