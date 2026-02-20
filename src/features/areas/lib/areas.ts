import { api } from "../../../lib/client";
import type { Area, CreateAreaDto, UpdateAreaDto } from "../types";

export const areasApi = {
  getAll: async (search?: string, signal?: AbortSignal) => {
    const { data } = await api.get("/areas", {
      params: { search },
      signal,
    });
    return data;
  },

  getById: async (id: string, signal?: AbortSignal) => {
    const { data } = await api.get<Area>(`/areas/${id}`, { signal });
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
