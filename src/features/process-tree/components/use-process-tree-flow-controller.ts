"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNodesState,
  type NodeMouseHandler,
  type OnNodeDrag,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import { toast } from "sonner";
import { useDeleteProcess, useUpdateProcess } from "@/src/features/processes";
import {
  PROCESS_TREE_QUERY_KEY,
  PROCESS_TREE_STATS_QUERY_KEY,
  useProcessTree,
} from "../hooks";
import { buildProcessTreeFlowElements } from "../lib";
import type {
  ProcessTreeItem,
  ProcessTreeNode as ProcessTreeNodeModel,
  ProcessTreeEdge,
} from "../types";
import { DROP_TARGET_OVERLAP_THRESHOLD } from "./process-tree-flow.constants";

interface UseProcessTreeFlowControllerResult {
  isLoading: boolean;
  isError: boolean;
  hasNodes: boolean;
  nodes: ProcessTreeNodeModel[];
  edges: ProcessTreeEdge[];
  onNodesChange: OnNodesChange<ProcessTreeNodeModel>;
  onInit: (instance: ReactFlowInstance<ProcessTreeNodeModel>) => void;
  onNodeClick: NodeMouseHandler<ProcessTreeNodeModel>;
  onNodeDragStart: OnNodeDrag<ProcessTreeNodeModel>;
  onNodeDrag: OnNodeDrag<ProcessTreeNodeModel>;
  onNodeDragStop: OnNodeDrag<ProcessTreeNodeModel>;
  nodesDraggable: boolean;
  selectedNode: ProcessTreeNodeModel | null;
  selectedNodeHasChildren: boolean;
  selectedNodeChildrenCount: number;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDetailsOpenChange: (open: boolean) => void;
  handleDeleteClick: () => void;
  handleConfirmDelete: () => void;
  isRootDropPreview: boolean;
  dragHintText: string | null;
  deletePending: boolean;
  updatePending: boolean;
}

export function useProcessTreeFlowController(
  areaId: string | null,
): UseProcessTreeFlowControllerResult {
  const queryClient = useQueryClient();
  const deleteProcess = useDeleteProcess();
  const updateProcess = useUpdateProcess();

  const isDraggingRef = useRef(false);
  const reactFlowRef = useRef<ReactFlowInstance<ProcessTreeNodeModel> | null>(
    null,
  );

  const { data, isLoading, isError } = useProcessTree(areaId);
  const [selectedNode, setSelectedNode] = useState<ProcessTreeNodeModel | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpenState] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTargetNodeId, setDropTargetNodeId] = useState<string | null>(null);
  const [isDropTargetForbidden, setIsDropTargetForbidden] = useState(false);

  const { nodes: layoutNodes, edges } = useMemo(
    () => buildProcessTreeFlowElements(data ?? []),
    [data],
  );

  const [flowNodes, setFlowNodes, onNodesChange] =
    useNodesState<ProcessTreeNodeModel>(layoutNodes);

  useEffect(() => {
    setFlowNodes(layoutNodes);
  }, [layoutNodes, setFlowNodes]);

  const { parentById, descendantsById } = useMemo(() => {
    const parentMap = new Map<string, string | null>();
    const descendantsMap = new Map<string, Set<string>>();

    const walk = (
      node: ProcessTreeItem,
      parentId: string | null,
    ): Set<string> => {
      parentMap.set(node.id, parentId);

      const descendants = new Set<string>();
      for (const child of node.children) {
        descendants.add(child.id);
        const childDescendants = walk(child, node.id);
        childDescendants.forEach((childDescendantId) =>
          descendants.add(childDescendantId),
        );
      }

      descendantsMap.set(node.id, descendants);
      return descendants;
    };

    for (const root of data ?? []) {
      walk(root, null);
    }

    return { parentById: parentMap, descendantsById: descendantsMap };
  }, [data]);

  const selectedNodeChildrenCount = useMemo(() => {
    if (!selectedNode) return 0;
    return edges.filter((edge) => edge.source === selectedNode.id).length;
  }, [edges, selectedNode]);
  const selectedNodeHasChildren = selectedNodeChildrenCount > 0;

  const isRootDropPreview = Boolean(
    draggedNodeId && !dropTargetNodeId && !isDropTargetForbidden,
  );

  const visualNodes = useMemo(
    () =>
      flowNodes.map((node) => {
        const isDropTarget = node.id === dropTargetNodeId;

        return {
          ...node,
          data: {
            ...node.data,
            isDragging: node.id === draggedNodeId,
            isDropTarget,
            isDropForbidden: isDropTarget && isDropTargetForbidden,
          },
        };
      }),
    [flowNodes, draggedNodeId, dropTargetNodeId, isDropTargetForbidden],
  );

  const refreshTreeQueries = () => {
    queryClient.invalidateQueries({ queryKey: PROCESS_TREE_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: PROCESS_TREE_STATS_QUERY_KEY });
  };

  const closeDetailsDialog = () => {
    setSelectedNode(null);
    setIsDeleteDialogOpenState(false);
  };

  const handleDetailsOpenChange = (open: boolean) => {
    if (!open) {
      closeDetailsDialog();
    }
  };

  const finishDragTracking = () => {
    setDraggedNodeId(null);
    setDropTargetNodeId(null);
    setIsDropTargetForbidden(false);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  const getNodeRect = (nodeId: string) => {
    const flowInstance = reactFlowRef.current;
    if (!flowInstance) {
      return null;
    }

    const internalNode = flowInstance.getInternalNode(nodeId);
    if (!internalNode) {
      return null;
    }

    const width = internalNode.measured.width ?? internalNode.width ?? 0;
    const height = internalNode.measured.height ?? internalNode.height ?? 0;

    if (!width || !height) {
      return null;
    }

    return {
      x: internalNode.internals.positionAbsolute.x,
      y: internalNode.internals.positionAbsolute.y,
      width,
      height,
    };
  };

  const getDraggedNodeRect = (draggedNode: ProcessTreeNodeModel) => {
    const internalRect = getNodeRect(draggedNode.id);
    const width = internalRect?.width ?? draggedNode.width ?? 0;
    const height = internalRect?.height ?? draggedNode.height ?? 0;

    if (!width || !height) {
      return null;
    }

    return {
      x: draggedNode.position.x,
      y: draggedNode.position.y,
      width,
      height,
    };
  };

  const getRectOverlapRatio = (
    sourceRect: { x: number; y: number; width: number; height: number },
    targetRect: { x: number; y: number; width: number; height: number },
  ) => {
    const overlapWidth =
      Math.min(sourceRect.x + sourceRect.width, targetRect.x + targetRect.width) -
      Math.max(sourceRect.x, targetRect.x);
    const overlapHeight =
      Math.min(sourceRect.y + sourceRect.height, targetRect.y + targetRect.height) -
      Math.max(sourceRect.y, targetRect.y);

    if (overlapWidth <= 0 || overlapHeight <= 0) {
      return 0;
    }

    const overlapArea = overlapWidth * overlapHeight;
    const sourceArea = sourceRect.width * sourceRect.height;
    if (!sourceArea) {
      return 0;
    }

    return overlapArea / sourceArea;
  };

  const getDropTargetNode = (draggedNode: ProcessTreeNodeModel) => {
    const flowInstance = reactFlowRef.current;
    if (!flowInstance) {
      return null;
    }

    const candidateNodes = flowInstance
      .getIntersectingNodes({ id: draggedNode.id }, true)
      .filter((node) => node.id !== draggedNode.id);

    if (!candidateNodes.length) {
      return null;
    }

    const draggedRect = getDraggedNodeRect(draggedNode);
    if (!draggedRect) {
      return candidateNodes[0] ?? null;
    }

    const bestCandidate = candidateNodes
      .map((candidateNode) => {
        const targetRect = getNodeRect(candidateNode.id);
        if (!targetRect) {
          return { node: candidateNode, overlapRatio: 0 };
        }

        return {
          node: candidateNode,
          overlapRatio: getRectOverlapRatio(draggedRect, targetRect),
        };
      })
      .sort((a, b) => b.overlapRatio - a.overlapRatio)[0];

    if (
      !bestCandidate ||
      bestCandidate.overlapRatio < DROP_TARGET_OVERLAP_THRESHOLD
    ) {
      return null;
    }

    return bestCandidate.node;
  };

  const isInvalidDropTarget = (
    draggedId: string,
    dropTargetId: string | null,
  ) =>
    Boolean(
      dropTargetId && descendantsById.get(draggedId)?.has(dropTargetId),
    );

  const onNodeClick: NodeMouseHandler<ProcessTreeNodeModel> = (_event, node) => {
    if (isDraggingRef.current) {
      return;
    }

    setSelectedNode(node);
    setIsDeleteDialogOpenState(false);
  };

  const onNodeDragStart: OnNodeDrag<ProcessTreeNodeModel> = () => {
    isDraggingRef.current = true;
    setIsDeleteDialogOpenState(false);
    setDraggedNodeId(null);
    setDropTargetNodeId(null);
    setIsDropTargetForbidden(false);
  };

  const onNodeDrag: OnNodeDrag<ProcessTreeNodeModel> = (_event, draggedNode) => {
    setDraggedNodeId(draggedNode.id);

    const dropTarget = getDropTargetNode(draggedNode);
    const candidateParentId = dropTarget?.id ?? null;
    const invalidTarget = isInvalidDropTarget(draggedNode.id, candidateParentId);

    setDropTargetNodeId(candidateParentId);
    setIsDropTargetForbidden(invalidTarget);
  };

  const onNodeDragStop: OnNodeDrag<ProcessTreeNodeModel> = (
    _event,
    draggedNode,
  ) => {
    if (updateProcess.isPending) {
      finishDragTracking();
      return;
    }

    const currentParentId = parentById.get(draggedNode.id) ?? null;
    const dropTarget = getDropTargetNode(draggedNode);
    const nextParentId = dropTarget?.id ?? null;
    if (nextParentId === currentParentId) {
      finishDragTracking();
      return;
    }

    if (isInvalidDropTarget(draggedNode.id, nextParentId)) {
      toast.error(
        "Movimento inválido: não é possível definir um subprocesso como pai.",
      );
      refreshTreeQueries();
      finishDragTracking();
      return;
    }

    updateProcess.mutate(
      {
        id: draggedNode.id,
        data: { parentId: nextParentId },
      },
      {
        onSuccess: () => {
          refreshTreeQueries();
          finishDragTracking();
        },
        onError: () => {
          refreshTreeQueries();
          finishDragTracking();
        },
      },
    );
  };

  const handleDeleteClick = () => {
    if (!selectedNode) return;

    if (selectedNodeHasChildren) {
      toast.error(
        "Não é possível deletar este processo. Remova os subprocessos primeiro.",
      );
      return;
    }

    setIsDeleteDialogOpenState(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedNode) return;

    if (selectedNodeHasChildren) {
      toast.error(
        "Não é possível deletar este processo. Remova os subprocessos primeiro.",
      );
      setIsDeleteDialogOpenState(false);
      return;
    }

    deleteProcess.mutate(selectedNode.id, {
      onSuccess: () => {
        setIsDeleteDialogOpenState(false);
        setSelectedNode(null);
        refreshTreeQueries();
      },
    });
  };

  const dragHintText = !draggedNodeId
    ? null
    : dropTargetNodeId
      ? isDropTargetForbidden
        ? "Destino inválido para este processo"
        : "Solte para tornar subprocesso do card destacado"
      : "Solte aqui para tornar este processo raiz";

  return {
    isLoading,
    isError,
    hasNodes: flowNodes.length > 0,
    nodes: visualNodes,
    edges,
    onNodesChange,
    onInit: (instance) => {
      reactFlowRef.current = instance;
    },
    onNodeClick,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    nodesDraggable: !updateProcess.isPending && !deleteProcess.isPending,
    selectedNode,
    selectedNodeHasChildren,
    selectedNodeChildrenCount,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen: setIsDeleteDialogOpenState,
    handleDetailsOpenChange,
    handleDeleteClick,
    handleConfirmDelete,
    isRootDropPreview,
    dragHintText,
    deletePending: deleteProcess.isPending,
    updatePending: updateProcess.isPending,
  };
}
