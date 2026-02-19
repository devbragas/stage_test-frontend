"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { useDashboardStats } from "@/src/features/dashboard/hooks/useDashboardStats";
import {
  DASHBOARD_STAT_CARDS,
  priorityRiskChartConfig,
  processDistributionChartConfig,
} from "@/src/features/dashboard/lib/constants";
import {
  buildPriorityRiskData,
  buildProcessDistributionData,
  calculatePercentage,
  clampPercentage,
  getDashboardStatValue,
  getOperationalRiskColor,
  getOperationalRiskText,
  getProcessDistributionInsight,
} from "@/src/features/dashboard/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/shared/components/ui/chart";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  const totalProcesses = data?.totalProcesses ?? 0;
  const manualProcesses = data?.manualProcesses ?? 0;
  const systemicProcesses = data?.systemicProcesses ?? 0;
  const criticalProcesses = data?.criticalProcesses ?? 0;
  const highRiskProcesses = data?.highRiskProcesses ?? 0;
  const mediumRiskProcesses = data?.mediumRiskProcesses ?? 0;
  const lowRiskProcesses = data?.lowRiskProcesses ?? 0;
  const operationalRiskPercentage = data?.operationalRiskPercentage ?? 0;

  const chartData = buildProcessDistributionData(
    manualProcesses,
    systemicProcesses,
  );
  const priorityRiskData = buildPriorityRiskData(
    criticalProcesses,
    highRiskProcesses,
    mediumRiskProcesses,
    lowRiskProcesses,
  );

  const manualPercentage = calculatePercentage(manualProcesses, totalProcesses);
  const systemicPercentage = calculatePercentage(
    systemicProcesses,
    totalProcesses,
  );
  const insightText = getProcessDistributionInsight(
    totalProcesses,
    manualPercentage,
    systemicPercentage,
  );
  const operationalRiskText = getOperationalRiskText(operationalRiskPercentage);
  const clampedOperationalRiskPercentage = clampPercentage(
    operationalRiskPercentage,
  );
  const operationalRiskColor = getOperationalRiskColor(
    operationalRiskPercentage,
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral dos processos e áreas da organização
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STAT_CARDS.map((item) => (
          <Card
            key={item.title}
            className="border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-semibold tracking-tight">
                  {getDashboardStatValue(data, item.metric)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="h-full border-border/60">
          <CardHeader>
            <CardTitle className="text-base">
              Distribuição de Processos
            </CardTitle>
            <CardDescription>Manual vs Sistêmico</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="mx-auto h-55 w-55" />
            ) : isError ? (
              <p className="text-sm text-destructive">
                Não foi possível carregar os dados do dashboard.
              </p>
            ) : totalProcesses === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sem dados suficientes para renderizar o gráfico.
              </p>
            ) : (
              <ChartContainer
                config={processDistributionChartConfig}
                className="mx-auto h-55 w-55 !aspect-square"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="value"
                        hideLabel
                        formatter={(value, name) => [
                          `${value} processo(s)`,
                          name,
                        ]}
                      />
                    }
                  />

                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="segment"
                    innerRadius={64}
                    outerRadius={98}
                    paddingAngle={4}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.segment} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          {!isLoading && !isError && totalProcesses > 0 && (
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                {manualPercentage > systemicPercentage
                  ? `${manualPercentage}% manual (oportunidade de automação)`
                  : `${systemicPercentage}% sistêmico (boa maturidade operacional)`}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Manual: {manualProcesses} | Sistêmico: {systemicProcesses} |
                Total: {totalProcesses}
              </div>
              <div className="text-muted-foreground">{insightText}</div>
            </CardFooter>
          )}
        </Card>

        <Card className="h-full border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Risco por Prioridade</CardTitle>
            <CardDescription>Crítico, Alto, Médio e Baixo</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-65 w-full" />
            ) : isError ? (
              <p className="text-sm text-destructive">
                Não foi possível carregar os dados de risco.
              </p>
            ) : totalProcesses === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sem dados suficientes para renderizar o gráfico.
              </p>
            ) : (
              <ChartContainer
                config={priorityRiskChartConfig}
                className="h-65 w-full"
              >
                <BarChart
                  data={priorityRiskData}
                  margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="nivel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value} processo(s)`,
                          name,
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="processos" radius={8}>
                    {priorityRiskData.map((entry) => (
                      <Cell key={entry.priorityKey} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          {!isLoading && !isError && totalProcesses > 0 && (
            <CardFooter className="flex-col items-start gap-3 text-sm">
              <div className="w-full">
                <div className="mb-1 flex items-center justify-between text-muted-foreground">
                  <span>Risco operacional (críticos)</span>
                  <span className="font-medium">
                    {operationalRiskPercentage}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${clampedOperationalRiskPercentage}%`,
                      backgroundColor: operationalRiskColor,
                    }}
                  />
                </div>
              </div>
              <p className="text-muted-foreground">{operationalRiskText}</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
