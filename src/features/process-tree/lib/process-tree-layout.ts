import { type Edge } from "@xyflow/react";
import {
  PROCESS_TREE_NODE_TYPE,
  type ProcessTreeFlowElements,
  type ProcessTreeItem,
  type ProcessTreeNode,
} from "../types";

const HORIZONTAL_STEP = 160;
const VERTICAL_STEP = 170;
const ROOT_GAP_UNITS = 1;

function getLeafSpan(
  node: ProcessTreeItem,
  spanById: Map<string, number>,
): number {
  if (!node.children.length) {
    spanById.set(node.id, 1);
    return 1;
  }

  const totalSpan = node.children.reduce((acc, child) => {
    return acc + getLeafSpan(child, spanById);
  }, 0);

  spanById.set(node.id, totalSpan);
  return totalSpan;
}

export function buildProcessTreeFlowElements(
  tree: ProcessTreeItem[],
): ProcessTreeFlowElements {
  if (!tree.length) {
    return { nodes: [], edges: [] };
  }

  const spanById = new Map<string, number>();
  for (const root of tree) {
    getLeafSpan(root, spanById);
  }

  const nodes: ProcessTreeNode[] = [];
  const edges: Edge[] = [];

  const walk = (node: ProcessTreeItem, depth: number, leafStart: number) => {
    const nodeSpan = spanById.get(node.id) ?? 1;
    const centerLeaf = leafStart + nodeSpan / 2;

    nodes.push({
      id: node.id,
      type: PROCESS_TREE_NODE_TYPE,
      position: {
        x: centerLeaf * HORIZONTAL_STEP,
        y: depth * VERTICAL_STEP,
      },
      data: {
        name: node.name,
        description: node.description,
        depth: depth + 1,
        priority: node.priority,
        status: node.status,
        type: node.type,
      },
      draggable: false,
    });

    let currentLeafStart = leafStart;
    for (const child of node.children) {
      edges.push({
        id: `${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
        type: "smoothstep",
        style: {
          stroke: "#94a3b8",
          strokeWidth: 1.5,
        },
      });

      walk(child, depth + 1, currentLeafStart);
      currentLeafStart += spanById.get(child.id) ?? 1;
    }
  };

  let rootStart = 0;
  for (const root of tree) {
    walk(root, 0, rootStart);
    rootStart += (spanById.get(root.id) ?? 1) + ROOT_GAP_UNITS;
  }

  return { nodes, edges };
}
