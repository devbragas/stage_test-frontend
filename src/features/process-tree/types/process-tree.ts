import type { Edge, Node } from "@xyflow/react";
import type { ProcessPriority, ProcessStatus, ProcessType } from "@/src/features/processes";

export interface ProcessTreeItem {
  id: string;
  name: string;
  priority: ProcessPriority;
  status: ProcessStatus;
  type: ProcessType;
  children: ProcessTreeItem[];
}

export interface ProcessTreeNodeData extends Record<string, unknown> {
  name: string;
  priority: ProcessPriority;
  status: ProcessStatus;
  type: ProcessType;
}

export const PROCESS_TREE_NODE_TYPE = "processTreeNode";

export type ProcessTreeNode = Node<
  ProcessTreeNodeData,
  typeof PROCESS_TREE_NODE_TYPE
>;
export type ProcessTreeEdge = Edge;

export interface ProcessTreeFlowElements {
  nodes: ProcessTreeNode[];
  edges: ProcessTreeEdge[];
}
