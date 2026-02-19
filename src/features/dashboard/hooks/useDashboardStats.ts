import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/client";
import { areasApi } from "@/src/features/areas/lib/areas";
import { processesApi } from "@/src/features/processes/lib/api/processes";
import type { Process } from "@/src/features/processes/types/process";
import type { Area } from "@/src/features/areas/types/area";
import type {
  DashboardProcessStatsResponse,
  DashboardStats,
} from "@/src/features/dashboard/types";

const DASHBOARD_STATS_QUERY_KEY = ["dashboard", "stats"];

async function fetchAllProcesses(): Promise<Process[]> {
  const allProcesses: Process[] = [];
  const limit = 100;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await processesApi.getAll({ skip, limit });
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
  // Accept both legacy and current status values while backend is being stabilized.
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
    queryFn: async (): Promise<DashboardStats> => {
      const [processes, areas, processStats] = await Promise.all([
        fetchAllProcesses(),
        areasApi.getAll() as Promise<Area[]>,
        api
          .get<DashboardProcessStatsResponse>("/processes/stats")
          .then((response) => response.data)
          .catch(() => null),
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
