import api from './api';

export const transactionService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/transactions/summary');
    return response.data;
  },

  getRecent: async (limit = 5) => {
    const response = await api.get(`/transactions/recent?limit=${limit}`);
    return response.data;
  },
};

export default transactionService;
