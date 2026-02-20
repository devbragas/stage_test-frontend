"use client";

import { useMemo } from "react";
import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import { AlertTriangle, Network } from "lucide-react";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { useProcessTree } from "../hooks";
import { buildProcessTreeFlowElements } from "../lib";
import { ProcessTreeNode } from "./process-tree-node";
import { PROCESS_TREE_NODE_TYPE } from "../types";

interface ProcessTreeFlowProps {
  areaId: string | null;
  className?: string;
}

const nodeTypes = {
  [PROCESS_TREE_NODE_TYPE]: ProcessTreeNode,
};

export function ProcessTreeFlow({ areaId, className }: ProcessTreeFlowProps) {
  const { data, isLoading, isError } = useProcessTree(areaId);

  const { nodes, edges } = useMemo(
    () => buildProcessTreeFlowElements(data ?? []),
    [data],
  );

  if (!areaId) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex h-[520px] flex-col items-center justify-center gap-2 text-center">
          <Network className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Selecione uma área para visualizar a árvore de processos.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-border/60">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-[440px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex h-[520px] flex-col items-center justify-center gap-2 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar a árvore de processos.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (nodes.length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex h-[520px] flex-col items-center justify-center gap-2 text-center">
          <Network className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Não foi possível montar a árvore para esta área.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={`w-full rounded-xl border border-border/60 bg-card/40 ${className ?? ""}`}
      style={{ width: "100%", height: 620, minHeight: 520 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        style={{ width: "100%", height: "100%" }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        connectOnClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          pannable
          zoomable
          nodeColor="#64748b"
          nodeStrokeWidth={3}
          position="bottom-left"
        />
        <Controls showInteractive={false} position="bottom-right" />
        <Background
          id="process-tree-grid"
          color="rgba(100, 116, 139, 0.25)"
          size={1}
          gap={20}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
}
