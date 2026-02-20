import { useQuery } from "@tanstack/react-query";
import { getProcessTreeStats } from "../lib";
import type { ProcessTreeStats } from "../types";

export const PROCESS_TREE_STATS_QUERY_KEY = ["process-tree-stats"];

export function useProcessTreeStats(areaId: string | null | undefined) {
  return useQuery({
    queryKey: [...PROCESS_TREE_STATS_QUERY_KEY, areaId],
    queryFn: async ({ signal }): Promise<ProcessTreeStats> => {
      if (!areaId) return {};
      return getProcessTreeStats(areaId, signal);
    },
    enabled: Boolean(areaId),
  });
}
