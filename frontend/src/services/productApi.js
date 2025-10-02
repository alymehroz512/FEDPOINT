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

export const addProduct = (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'image' && productData.image) {
      formData.append(key, productData.image);
    } else {
      formData.append(key, productData[key]);
    }
  });
  return api.post('/api/products', formData);
};

export const getProducts = (params = {}) => api.get('/api/products', { params });
export const updateProduct = (id, productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'image' && productData.image) {
      formData.append(key, productData.image);
    } else {
      formData.append(key, productData[key]);
    }
  });
  return api.put(`/api/products/${id}`, formData);
};

export const deleteProduct = (id) => api.delete(`/api/products/${id}`);