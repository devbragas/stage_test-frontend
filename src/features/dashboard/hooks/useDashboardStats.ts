import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/client";
import { areasApi } from "@/src/features/areas/lib/areas";
import { processesApi } from "@/src/features/processes/lib/api/processes";
import { Process } from "@/src/features/processes/types/process";
import { Area } from "@/src/features/areas/types/area";

export interface DashboardProcessStatsResponse {
  totalProcesses: number;
  activeProcesses: number;
  manualProcesses: number;
  systemicProcesses: number;
}

export interface DashboardStats extends DashboardProcessStatsResponse {
  totalAreas: number;
  criticalProcesses: number;
  highRiskProcesses: number;
  mediumRiskProcesses: number;
  lowRiskProcesses: number;
  operationalRiskPercentage: number;
}

const DASHBOARD_STATS_QUERY_KEY = ["dashboard", "stats"];

function isCanceledRequest(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ERR_CANCELED"
  );
}

async function fetchAllProcesses(signal?: AbortSignal): Promise<Process[]> {
  const allProcesses: Process[] = [];
  const limit = 100;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await processesApi.getAll({ skip, limit }, signal);
    allProcesses.push(...response.data);

    if (response.meta.hasMore) {
      skip += limit;
    } else {
      hasMore = false;
    }
  }

  return allProcesses;
}

function calculateStatsFromProcesses(
  processes: Process[],
): DashboardProcessStatsResponse {
  const manualProcesses = processes.filter(
    (process) => process.type === "MANUAL",
  ).length;
  const systemicProcesses = processes.filter(
    (process) => process.type === "SISTEMIC",
  ).length;
  const activeProcesses = processes.filter((process) => {
    const status = String(process.status);
    return status === "ACTIVE" || status === "ATIVO";
  }).length;

  return {
    totalProcesses: processes.length,
    activeProcesses,
    manualProcesses,
    systemicProcesses,
  };
}

function calculatePriorityStats(processes: Process[]) {
  const criticalProcesses = processes.filter(
    (process) => process.priority === "CRITICA",
  ).length;
  const highRiskProcesses = processes.filter(
    (process) => process.priority === "ALTA",
  ).length;
  const mediumRiskProcesses = processes.filter(
    (process) => process.priority === "MEDIA",
  ).length;
  const lowRiskProcesses = processes.filter(
    (process) => process.priority === "BAIXA",
  ).length;

  const totalProcesses = processes.length;
  const operationalRiskPercentage =
    totalProcesses > 0
      ? Number(((criticalProcesses / totalProcesses) * 100).toFixed(1))
      : 0;

  return {
    criticalProcesses,
    highRiskProcesses,
    mediumRiskProcesses,
    lowRiskProcesses,
    operationalRiskPercentage,
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    queryFn: async ({ signal }): Promise<DashboardStats> => {
      const [processes, areas, processStats] = await Promise.all([
        fetchAllProcesses(signal),
        areasApi.getAll(undefined, signal) as Promise<Area[]>,
        api
          .get<DashboardProcessStatsResponse>("/processes/stats", { signal })
          .then((response) => response.data)
          .catch((error) => {
            if (isCanceledRequest(error)) {
              throw error;
            }
            return null;
          }),
      ]);

      const fallbackProcessStats = calculateStatsFromProcesses(processes);
      const priorityStats = calculatePriorityStats(processes);

      return {
        ...(processStats || fallbackProcessStats),
        totalAreas: areas.length,
        ...priorityStats,
      };
    },
  });
}
