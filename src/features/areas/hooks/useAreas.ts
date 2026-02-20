import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areasApi } from "../services";
import type { CreateAreaDto, UpdateAreaDto } from "../types";
import { toast } from "sonner";
import { processesApi } from "@/src/features/processes/services";

export const AREAS_QUERY_KEY = ["areas"];
const AREA_HAS_ACTIVE_PROCESSES_ERROR = "AREA_HAS_ACTIVE_PROCESSES";

export function useAreas(search?: string) {
  return useQuery({
    queryKey: [...AREAS_QUERY_KEY, search],
    queryFn: ({ signal }) => areasApi.getAll(search, signal),
  });
}

export function useArea(id: string) {
  return useQuery({
    queryKey: [...AREAS_QUERY_KEY, id],
    queryFn: ({ signal }) => areasApi.getById(id, signal),
    enabled: !!id,
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAreaDto) => areasApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
      toast.success("Área criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar área");
      console.error(error);
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaDto }) =>
      areasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
      toast.success("Área atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar área");
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const processes = await processesApi.getByArea(id);
      const hasActiveProcesses = processes.some((process) => {
        const normalizedStatus = String(process.status).toUpperCase();
        return normalizedStatus === "ACTIVE" || normalizedStatus === "ATIVO";
      });

      if (hasActiveProcesses) {
        throw new Error(AREA_HAS_ACTIVE_PROCESSES_ERROR);
      }

      await areasApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
      toast.success("Área deletada");
    },
    onError: (error) => {
      if (
        error instanceof Error &&
        error.message === AREA_HAS_ACTIVE_PROCESSES_ERROR
      ) {
        toast.error(
          "Não é possível deletar esta área porque ela possui processos ativos.",
        );
        return;
      }

      toast.error("Erro ao deletar área");
    },
  });
}
