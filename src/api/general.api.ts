import api from "./axios";

export const createCrudService = (endpoint: string) => {
  return {
    getAll: (params?: any) => {

      if (params?.customUrl) {
        return api.get(`${endpoint}${params.customUrl}`);
      }

      return api.get(endpoint, { params });
    },
    get: (url: string, params?: any) =>
      api.get(`${endpoint}${url}`, { params }),

    getById: (id: number | string) =>
      api.get(`${endpoint}/${id}`),

    create: (data: any, config: any = {}) => {
      const isFormData = data instanceof FormData;

      return api.post(
        endpoint,
        data,
        isFormData
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            ...config,
          }
          : config
      );
    },

    update: (id: number | string, data: any, config: any = {}) => {
      const isFormData = data instanceof FormData;

      return api.put(
        `${endpoint}/${id}`,
        data,
        isFormData
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            ...config,
          }
          : config
      );
    },

    delete: (id: number | string) =>
      api.delete(`${endpoint}/${id}`),
  };
};