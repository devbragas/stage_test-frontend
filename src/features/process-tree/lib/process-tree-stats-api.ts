import { api } from "@/src/lib/client";
import type { ProcessTreeStats } from "../types";

type ProcessTreeStatsApiResponse = ProcessTreeStats | { data: ProcessTreeStats };

export async function getProcessTreeStats(areaId: string): Promise<ProcessTreeStats> {
  const { data } = await api.get<ProcessTreeStatsApiResponse>(
    `/processes/area/${areaId}/stats`,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return (data ?? {}) as ProcessTreeStats;
}
