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

export type ProcessDistributionDatum = {
  segment: "manual" | "sistemico";
  value: number;
  fill: string;
};

export type PriorityRiskKey = "critica" | "alta" | "media" | "baixa";

export type PriorityRiskLevel = "Crítico" | "Alto" | "Médio" | "Baixo";

export type PriorityRiskDatum = {
  priorityKey: PriorityRiskKey;
  nivel: PriorityRiskLevel;
  processos: number;
  fill: string;
};

export const riskPriorityOrder: Record<PriorityRiskKey, number> = {
  critica: 0,
  alta: 1,
  media: 2,
  baixa: 3,
};
