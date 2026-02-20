"use client";

import { useState } from "react";
import { Network } from "lucide-react";
import { useAreas } from "@/src/features/areas";
import type { Area } from "@/src/features/areas";
import { ProcessTreeFlow } from "@/src/features/process-tree";
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

          <ProcessTreeFlow areaId={effectiveSelectedAreaId} />
        </>
      )}
    </div>
  );
}
