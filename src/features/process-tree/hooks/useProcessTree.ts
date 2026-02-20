import { useQuery } from "@tanstack/react-query";
import { getProcessTree } from "../lib";
import type { ProcessTreeItem } from "../types";

export const PROCESS_TREE_QUERY_KEY = ["process-tree"];

export function useProcessTree(areaId: string | null | undefined) {
  return useQuery({
    queryKey: [...PROCESS_TREE_QUERY_KEY, areaId],
    queryFn: async (): Promise<ProcessTreeItem[]> => {
      if (!areaId) return [];
      return getProcessTree(areaId);
    },
    enabled: Boolean(areaId),
  });
}
