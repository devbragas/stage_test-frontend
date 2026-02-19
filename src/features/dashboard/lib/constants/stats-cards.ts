import { Building2, CheckCircle2, Hand, Workflow } from "lucide-react";

export const DASHBOARD_STAT_CARDS = [
  {
    title: "Total de Processos",
    metric: "totalProcesses",
    icon: Workflow,
  },
  {
    title: "Processos Ativos",
    metric: "activeProcesses",
    icon: CheckCircle2,
  },
  {
    title: "Processos Manuais",
    metric: "manualProcesses",
    icon: Hand,
  },
  {
    title: "Total de Áreas",
    metric: "totalAreas",
    icon: Building2,
  },
] as const;

export type DashboardStatCardMetric =
  (typeof DASHBOARD_STAT_CARDS)[number]["metric"];
