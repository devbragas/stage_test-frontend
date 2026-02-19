import type { DashboardStats } from "@/src/features/dashboard/types";
import type { DashboardStatCardMetric } from "@/src/features/dashboard/lib/constants/stats-cards";
import {
  riskPriorityOrder,
  type PriorityRiskDatum,
  type ProcessDistributionDatum,
} from "@/src/features/dashboard/types";

const HIGH_OPERATIONAL_RISK_THRESHOLD = 40;
const MODERATE_OPERATIONAL_RISK_THRESHOLD = 20;

export function calculatePercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
}

export function clampPercentage(value: number): number {
  return Math.max(0, Math.min(value, 100));
}

export function getDashboardStatValue(
  stats: DashboardStats | undefined,
  metric: DashboardStatCardMetric,
): number {
  if (!stats) return 0;
  return stats[metric];
}

export function buildProcessDistributionData(
  manualProcesses: number,
  systemicProcesses: number,
): ProcessDistributionDatum[] {
  return [
    {
      segment: "manual",
      value: manualProcesses,
      fill: "var(--color-manual)",
    },
    {
      segment: "sistemico",
      value: systemicProcesses,
      fill: "var(--color-sistemico)",
    },
  ];
}

export function buildPriorityRiskData(
  criticalProcesses: number,
  highRiskProcesses: number,
  mediumRiskProcesses: number,
  lowRiskProcesses: number,
): PriorityRiskDatum[] {
  return [
    {
      priorityKey: "critica",
      nivel: "Crítico",
      processos: criticalProcesses,
      fill: "var(--color-critica)",
    },
    {
      priorityKey: "alta",
      nivel: "Alto",
      processos: highRiskProcesses,
      fill: "var(--color-alta)",
    },
    {
      priorityKey: "media",
      nivel: "Médio",
      processos: mediumRiskProcesses,
      fill: "var(--color-media)",
    },
    {
      priorityKey: "baixa",
      nivel: "Baixo",
      processos: lowRiskProcesses,
      fill: "var(--color-baixa)",
    },
  ].sort((a, b) => {
    if (b.processos !== a.processos) {
      return b.processos - a.processos;
    }

    return riskPriorityOrder[a.priorityKey] - riskPriorityOrder[b.priorityKey];
  });
}

export function getProcessDistributionInsight(
  totalProcesses: number,
  manualPercentage: number,
  systemicPercentage: number,
): string {
  if (totalProcesses === 0) {
    return "Ainda não há processos cadastrados para análise.";
  }

  if (manualPercentage > systemicPercentage) {
    return `${manualPercentage}% dos processos são manuais, indicando oportunidade de automação.`;
  }

  if (systemicPercentage > manualPercentage) {
    return `${systemicPercentage}% dos processos já são sistêmicos, refletindo boa maturidade operacional.`;
  }

  return `Manual e sistêmico estão equilibrados em ${manualPercentage}%.`;
}

export function getOperationalRiskText(
  operationalRiskPercentage: number,
): string {
  if (operationalRiskPercentage >= HIGH_OPERATIONAL_RISK_THRESHOLD) {
    return `${operationalRiskPercentage}% de risco operacional (alto) pela quantidade de processos críticos.`;
  }

  if (operationalRiskPercentage >= MODERATE_OPERATIONAL_RISK_THRESHOLD) {
    return `${operationalRiskPercentage}% de risco operacional (moderado) com atenção aos processos críticos.`;
  }

  return `${operationalRiskPercentage}% de risco operacional (controlado) em processos críticos.`;
}

export function getOperationalRiskColor(
  operationalRiskPercentage: number,
): string {
  if (operationalRiskPercentage >= HIGH_OPERATIONAL_RISK_THRESHOLD) {
    return "#ef4444";
  }

  if (operationalRiskPercentage >= MODERATE_OPERATIONAL_RISK_THRESHOLD) {
    return "#f97316";
  }

  return "#22c55e";
}
