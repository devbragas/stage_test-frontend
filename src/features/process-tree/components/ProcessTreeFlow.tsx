"use client";

import { useMemo, useState } from "react";
import "@xyflow/react/dist/style.css";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import { AlertTriangle, Bot, Hand, Network } from "lucide-react";
import { Badge } from "@/src/shared/components/ui/badge";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { useProcessTree } from "../hooks";
import { buildProcessTreeFlowElements } from "../lib";
import { ProcessTreeNode } from "./process-tree-node";
import {
  PROCESS_TREE_NODE_TYPE,
  type ProcessTreeNode as ProcessTreeNodeModel,
} from "../types";

interface ProcessTreeFlowProps {
  areaId: string | null;
  areaName?: string;
  className?: string;
}

const nodeTypes = {
  [PROCESS_TREE_NODE_TYPE]: ProcessTreeNode,
};

export function ProcessTreeFlow({
  areaId,
  areaName,
  className,
}: ProcessTreeFlowProps) {
  const { data, isLoading, isError } = useProcessTree(areaId);
  const [selectedNode, setSelectedNode] = useState<ProcessTreeNodeModel | null>(
    null,
  );

  const { nodes, edges } = useMemo(
    () => buildProcessTreeFlowElements(data ?? []),
    [data],
  );

  const badgeStyles = {
    ACTIVE: {
      backgroundColor: "#dcfce7",
    },
    INACTIVE: {
      backgroundColor: "#64748b6",
    },
  };

  const handleNodeClick: NodeMouseHandler<ProcessTreeNodeModel> = (
    _event,
    node,
  ) => {
    setSelectedNode(node);
  };

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
    <>
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
          onNodeClick={handleNodeClick}
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

      <Dialog
        open={Boolean(selectedNode)}
        onOpenChange={() => setSelectedNode(null)}
      >
        <DialogContent className="sm:max-w-lg !p-0">
          <div className="px-1.5 py-3.5">
            <DialogHeader className="mb-4">
              <DialogTitle>Detalhes do Processo</DialogTitle>
            </DialogHeader>

            {selectedNode && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-border/70 px-4 py-4">
                  <div className="mt-0.5 text-muted-foreground">
                    {selectedNode.data.type === "MANUAL" ? (
                      <Hand className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="text-base font-semibold text-foreground">
                      {selectedNode.data.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedNode.data.type === "MANUAL"
                        ? "Manual"
                        : "Sistêmico"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <Badge style={badgeStyles[selectedNode.data.status]}>
                        {selectedNode.data.status === "ACTIVE"
                          ? "Ativo"
                          : "Inativo"}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Área</p>
                    <p className="mt-1 text-sm font-medium">
                      {areaName || "-"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">
                      Profundidade
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Nível {selectedNode.data.depth}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/70 px-4 py-4">
                  <p className="text-xs text-muted-foreground">Descrição</p>
                  <p className="mt-1 text-sm text-foreground">
                    {selectedNode.data.description?.trim() ||
                      "Sem descrição informada."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
