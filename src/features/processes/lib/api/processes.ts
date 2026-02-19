import { api } from "@/src/lib/client";
import {
  Process,
  CreateProcessDto,
  UpdateProcessDto,
  ProcessesResponse,
} from "../../types/process";

export const processesApi = {
  getAll: async (params?: {
    search?: string;
    areaId?: string;
    skip?: number;
    limit?: number;
  }) => {
    const cleanParams: Record<string, any> = {};

    if (params?.search?.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params?.areaId) {
      cleanParams.areaId = params.areaId;
    }
    if (params?.skip !== undefined) {
      cleanParams.skip = params.skip;
    }
    if (params?.limit !== undefined) {
      cleanParams.limit = params.limit;
    }

    const { data } = await api.get<ProcessesResponse>("/processes", {
      params: cleanParams,
    });
    return data;
  },

  getByArea: async (areaId: string) => {
    const { data } = await api.get<Process[]>(`/processes/area/${areaId}`);
    return data;
  },

  getTreeByArea: async (areaId: string) => {
    const { data } = await api.get<Process[]>(`/processes/area/${areaId}/tree`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Process>(`/processes/${id}`);
    return data;
  },

  create: async (dto: CreateProcessDto) => {
    const { data } = await api.post<Process>("/processes", dto);
    return data;
  },

  update: async (id: string, dto: UpdateProcessDto) => {
    const { data } = await api.patch<Process>(`/processes/${id}`, dto);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/processes/${id}`);
  },

  getStats: async (areaId: string) => {
    const { data } = await api.get(`/processes/area/${areaId}/stats`);
    return data;
  },
};
