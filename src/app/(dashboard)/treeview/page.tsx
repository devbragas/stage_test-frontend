"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Network } from "lucide-react";
import { useAreas } from "@/src/features/areas";
import type { Area } from "@/src/features/areas";
import {
  ProcessTreeFlow,
  buildProcessTreeInsights,
  useProcessTree,
  useProcessTreeStats,
} from "@/src/features/process-tree";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

export default function TreeViewPage() {
  const { data: areas = [], isLoading: isLoadingAreas } = useAreas();
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const effectiveSelectedAreaId = selectedAreaId || areas[0]?.id || null;
  const selectedAreaName =
    areas.find((area: Area) => area.id === effectiveSelectedAreaId)?.name || "";
  const { data: treeData } = useProcessTree(effectiveSelectedAreaId);
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useProcessTreeStats(effectiveSelectedAreaId);

  const insights = useMemo(
    () => buildProcessTreeInsights(statsData, treeData),
    [statsData, treeData],
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TreeView</h1>
        <p className="mt-1 text-muted-foreground">
          Visão hierárquica dos processos e subprocessos
        </p>
      </div>

      {!isLoadingAreas && areas.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex h-[520px] flex-col items-center justify-center gap-2 text-center">
            <Network className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhuma área cadastrada para exibir árvore de processos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
            <span className="text-sm text-muted-foreground">
              Área selecionada:
            </span>
            <div className="w-full max-w-xs">
              {isLoadingAreas ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={effectiveSelectedAreaId ?? ""}
                  onValueChange={(value) => setSelectedAreaId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area: Area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Profundidade máxima da cadeia
                </p>
                {isLoadingStats ? (
                  <Skeleton className="mt-2 h-6 w-24" />
                ) : (
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {insights.maxDepth}{" "}
                    {insights.maxDepth === 1 ? "nível" : "níveis"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Processos críticos na cadeia
                </p>
                {isLoadingStats ? (
                  <Skeleton className="mt-2 h-6 w-16" />
                ) : (
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {insights.criticalProcesses}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Gargalo identificado
                </p>
                {isLoadingStats ? (
                  <Skeleton className="mt-2 h-6 w-28" />
                ) : isErrorStats ? (
                  <div className="mt-1 flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Sem dados de gargalo
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {insights.bottleneckLevel
                      ? `Nível ${insights.bottleneckLevel}`
                      : "Não identificado"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <ProcessTreeFlow
            key={effectiveSelectedAreaId ?? "no-area"}
            areaId={effectiveSelectedAreaId}
            areaName={selectedAreaName}
          />
        </>
      )}
    </div>
  );
}
