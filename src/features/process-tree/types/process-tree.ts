import type { Edge, Node } from "@xyflow/react";
import type { ProcessPriority, ProcessStatus, ProcessType } from "@/src/features/processes";

export interface ProcessTreeItem {
  id: string;
  name: string;
  description?: string;
  priority: ProcessPriority;
  status: ProcessStatus;
  type: ProcessType;
  children: ProcessTreeItem[];
}

export interface ProcessTreeNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  depth: number;
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

export interface ProcessTreeStats extends Record<string, unknown> {
  totalProcesses?: number;
  activeProcesses?: number;
  manualProcesses?: number;
  automatedProcesses?: number;
  maxDepth?: number;
  criticalProcesses?: number;
  bottleneckLevel?: number;
}

export interface ProcessTreeInsights {
  maxDepth: number;
  criticalProcesses: number;
  bottleneckLevel: number | null;
}
