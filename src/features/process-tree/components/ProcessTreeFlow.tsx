"use client";

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
import { ProcessTreeDetailsDialog } from "./process-tree-details-dialog";
import { PROCESS_TREE_NODE_TYPE } from "../types";
import { ProcessTreeNode } from "./process-tree-node";
import { useProcessTreeFlowController } from "./use-process-tree-flow-controller";

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
  const flow = useProcessTreeFlowController(areaId);

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

  if (flow.isLoading) {
    return (
      <Card className="border-border/60">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-[440px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (flow.isError) {
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

  if (!flow.hasNodes) {
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
        className={`relative w-full rounded-xl border border-border/60 bg-card/40 transition-colors ${
          flow.isRootDropPreview ? "ring-2 ring-emerald-500/40" : ""
        } ${className ?? ""}`}
        style={{ width: "100%", height: 620, minHeight: 520 }}
      >
        {flow.dragHintText && (
          <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-md border border-border bg-background/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            {flow.dragHintText}
          </div>
        )}

        <ReactFlow
          nodes={flow.nodes}
          edges={flow.edges}
          nodeTypes={nodeTypes}
          onNodesChange={flow.onNodesChange}
          onInit={flow.onInit}
          style={{ width: "100%", height: "100%" }}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={flow.nodesDraggable}
          nodesConnectable={false}
          elementsSelectable={false}
          connectOnClick={false}
          onNodeClick={flow.onNodeClick}
          onNodeDragStart={flow.onNodeDragStart}
          onNodeDrag={flow.onNodeDrag}
          onNodeDragStop={flow.onNodeDragStop}
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

      <ProcessTreeDetailsDialog
        open={Boolean(flow.selectedNode)}
        node={flow.selectedNode}
        areaName={areaName}
        onOpenChange={flow.handleDetailsOpenChange}
        selectedNodeHasChildren={flow.selectedNodeHasChildren}
        selectedNodeChildrenCount={flow.selectedNodeChildrenCount}
        isDeleteDialogOpen={flow.isDeleteDialogOpen}
        onDeleteDialogOpenChange={flow.setIsDeleteDialogOpen}
        onDeleteClick={flow.handleDeleteClick}
        onConfirmDelete={flow.handleConfirmDelete}
        deletePending={flow.deletePending}
        updatePending={flow.updatePending}
      />
    </>
  );
}

