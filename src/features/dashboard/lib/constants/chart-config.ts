import type { ChartConfig } from "@/src/shared/components/ui/chart";

export const processDistributionChartConfig = {
  manual: {
    label: "Manual",
    color: "var(--chart-2)",
  },
  sistemico: {
    label: "Sistêmico",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const priorityRiskChartConfig = {
  processos: {
    label: "Processos",
  },
  critica: {
    label: "Crítico",
    color: "#ef4444",
  },
  alta: {
    label: "Alto",
    color: "#f97316",
  },
  media: {
    label: "Médio",
    color: "#f59e0b",
  },
  baixa: {
    label: "Baixo",
    color: "#22c55e",
  },
} satisfies ChartConfig;
