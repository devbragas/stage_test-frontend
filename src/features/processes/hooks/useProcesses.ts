import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { processesApi } from "../services";
import type { CreateProcessDto, UpdateProcessDto } from "../types";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const PROCESSES_QUERY_KEY = ["processes"];

export function useProcesses(params?: {
  search?: string;
  areaId?: string;
  page?: number;
  limit?: number;
}) {
  const skip = params?.page ? (params.page - 1) * (params.limit || 20) : 0;

  return useQuery({
    queryKey: [...PROCESSES_QUERY_KEY, { ...params, skip }],
    queryFn: () => processesApi.getAll({ ...params, skip }),
  });
}

export function useProcessesByArea(areaId: string | undefined) {
  return useQuery({
    queryKey: [...PROCESSES_QUERY_KEY, "area", areaId],
    queryFn: () => processesApi.getByArea(areaId!),
    enabled: !!areaId,
  });
}

export function useProcessTreeByArea(areaId: string | undefined) {
  return useQuery({
    queryKey: [...PROCESSES_QUERY_KEY, "tree", areaId],
    queryFn: () => processesApi.getTreeByArea(areaId!),
    enabled: !!areaId,
  });
}

export function useProcess(id: string) {
  return useQuery({
    queryKey: [...PROCESSES_QUERY_KEY, id],
    queryFn: () => processesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProcessDto) => processesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROCESSES_QUERY_KEY });
      toast.success("Processo criado com sucesso!");
    },
    onError: (error: AxiosError) => {
      console.error("Erro ao criar processo:", error.response?.data);
    },
  });
}

export function useUpdateProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessDto }) =>
      processesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROCESSES_QUERY_KEY });
      toast.success("Processo atualizado!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        toast.error(
          "Não é possível inativar este processo. Inative ou remova os seus subprocessos antes de continuar.",
        );
        return;
      }

      toast.error("Erro ao atualizar processo");
      console.error("Erro ao atualizar processo", error.response?.data);
    },
  });
}

export function useDeleteProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => processesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROCESSES_QUERY_KEY });
      toast.success("Processo deletado");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        toast.error(
          "Não é possível deletar este processo. Remova os subprocessos antes.",
        );
        return;
      }

      toast.error("Erro ao deletar processo");
    },
  });
}
