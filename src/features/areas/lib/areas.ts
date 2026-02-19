import { api } from "../../../lib/client";
import { Area, CreateAreaDto, UpdateAreaDto } from "../types/area";

export const areasApi = {
  getAll: async (search?: string) => {
    const { data } = await api.get("/areas", {
      params: { search },
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Area>(`/areas/${id}`);
    return data;
  },

  create: async (dto: CreateAreaDto) => {
    const { data } = await api.post<Area>("/areas", dto);
    return data;
  },

  update: async (id: string, dto: UpdateAreaDto) => {
    const { data } = await api.patch<Area>(`/areas/${id}`, dto);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/areas/${id}`);
  },
};
