import type {
  ProcessTreeInsights,
  ProcessTreeItem,
  ProcessTreeStats,
} from "../types";

function readNumericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function pickNumericField(source: unknown, keys: string[]): number | null {
  if (!source || typeof source !== "object") return null;

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = readNumericValue(record[key]);
    if (value !== null) return value;
  }

  return null;
}

function computeDepthAndCritical(
  nodes: ProcessTreeItem[],
  depth = 1,
): { maxDepth: number; criticalCount: number; levelCounts: Map<number, number> } {
  const levelCounts = new Map<number, number>();
  let maxDepth = 0;
  let criticalCount = 0;

  const walk = (current: ProcessTreeItem[], currentDepth: number) => {
    if (!current.length) return;

    levelCounts.set(
      currentDepth,
      (levelCounts.get(currentDepth) ?? 0) + current.length,
    );
    maxDepth = Math.max(maxDepth, currentDepth);

    for (const node of current) {
      if (node.priority === "CRITICA") {
        criticalCount += 1;
      }

      if (node.children.length > 0) {
        walk(node.children, currentDepth + 1);
      }
    }
  };

  walk(nodes, depth);
  return { maxDepth, criticalCount, levelCounts };
}

function getBottleneckLevelFromCounts(levelCounts: Map<number, number>): number | null {
  let bottleneckLevel: number | null = null;
  let maxNodesAtLevel = 0;

  for (const [level, count] of levelCounts) {
    if (count > maxNodesAtLevel) {
      maxNodesAtLevel = count;
      bottleneckLevel = level;
    }
  }

  return bottleneckLevel;
}

export function buildProcessTreeInsights(
  stats: ProcessTreeStats | undefined,
  tree: ProcessTreeItem[] | undefined,
): ProcessTreeInsights {
  const treeNodes = tree ?? [];
  const { maxDepth, criticalCount, levelCounts } = computeDepthAndCritical(treeNodes);
  const computedBottleneckLevel = getBottleneckLevelFromCounts(levelCounts);

  const statsMaxDepth = pickNumericField(stats, ["maxDepth", "maximumDepth"]);
  const statsCritical = pickNumericField(stats, [
    "criticalProcesses",
    "criticalCount",
    "totalCriticalProcesses",
  ]);
  const statsBottleneck = pickNumericField(stats, [
    "bottleneckLevel",
    "bottleneckDepth",
    "bottleneckNodeLevel",
  ]);

  return {
    maxDepth: Math.max(0, Math.trunc(statsMaxDepth ?? maxDepth)),
    criticalProcesses: Math.max(0, Math.trunc(statsCritical ?? criticalCount)),
    bottleneckLevel: Math.max(
      0,
      Math.trunc(statsBottleneck ?? (computedBottleneckLevel ?? 0)),
    ) || null,
  };
}
