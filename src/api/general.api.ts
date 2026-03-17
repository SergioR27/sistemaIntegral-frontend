
import api from "./axios";

export const createCrudService = (endpoint: string) => {
  return {
    getAll: (params?: any) =>
      api.get(endpoint, { params }),

    getById: (id: number | string) =>
      api.get(`${endpoint}/${id}`),

    create: (data: any) =>
      api.post(endpoint, data),

    update: (id: number | string, data: any) =>
      api.put(`${endpoint}/${id}`, data),

    delete: (id: number | string) =>
      api.delete(`${endpoint}/${id}`),
  };
};