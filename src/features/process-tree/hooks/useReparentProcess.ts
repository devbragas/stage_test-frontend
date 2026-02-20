import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { processesApi } from "@/src/features/processes/services";
import { PROCESS_TREE_QUERY_KEY } from "./useProcessTree";
import { PROCESS_TREE_STATS_QUERY_KEY } from "./useProcessTreeStats";

interface ReparentProcessPayload {
  processId: string;
  parentId: string | null;
  areaId: string;
}

export function useReparentProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ processId, parentId }: ReparentProcessPayload) =>
      processesApi.update(processId, { parentId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PROCESS_TREE_QUERY_KEY, variables.areaId],
      });
      queryClient.invalidateQueries({
        queryKey: [...PROCESS_TREE_STATS_QUERY_KEY, variables.areaId],
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        toast.error(
          "Não foi possível mover o processo. Verifique a hierarquia e tente novamente.",
        );
        return;
      }

      toast.error("Erro ao atualizar a hierarquia do processo");
    },
  });
}

