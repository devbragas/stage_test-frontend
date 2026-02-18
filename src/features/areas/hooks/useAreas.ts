import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areasApi } from "../lib/areas";
import { CreateAreaDto, UpdateAreaDto } from "../../areas/types/area";
import { toast } from "sonner";

export const AREAS_QUERY_KEY = ["areas"];

export function useAreas() {
  return useQuery({
    queryKey: AREAS_QUERY_KEY,
    queryFn: areasApi.getAll,
  });
}

export function useArea(id: string) {
  return useQuery({
    queryKey: [...AREAS_QUERY_KEY, id],
    queryFn: () => areasApi.getById(id),
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
    mutationFn: (id: string) => areasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
      toast.success("Área deletada");
    },
    onError: () => {
      toast.error("Erro ao deletar área");
    },
  });
}
