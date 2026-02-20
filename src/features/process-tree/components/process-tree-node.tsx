"use client";

import type { CSSProperties } from "react";
import { Bot, Hand } from "lucide-react";
import { Badge } from "@/src/shared/components/ui/badge";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ProcessPriority } from "@/src/features/processes";
import type { ProcessTreeNode as ProcessTreeNodeModel } from "../types";

const priorityBadgeStyle: Record<
  ProcessPriority,
  {
    label: string;
    badgeStyle: CSSProperties;
    accentStyle: CSSProperties;
    iconStyle: CSSProperties;
    iconColor: string;
  }
> = {
  BAIXA: {
    label: "Baixa",
    badgeStyle: {
      backgroundColor: "#f1f5f9",
      color: "#334155",
      borderColor: "#cbd5e1",
    },
    accentStyle: {
      backgroundColor: "#94a3b8",
    },
    iconStyle: {
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
    },
    iconColor: "#475569",
  },
  MEDIA: {
    label: "Média",
    badgeStyle: {
      backgroundColor: "#e0f2fe",
      color: "#075985",
      borderColor: "#7dd3fc",
    },
    accentStyle: {
      backgroundColor: "#0ea5e9",
    },
    iconStyle: {
      backgroundColor: "#f0f9ff",
      borderColor: "#7dd3fc",
    },
    iconColor: "#0284c7",
  },
  ALTA: {
    label: "Alta",
    badgeStyle: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      borderColor: "#fcd34d",
    },
    accentStyle: {
      backgroundColor: "#f59e0b",
    },
    iconStyle: {
      backgroundColor: "#fffbeb",
      borderColor: "#fcd34d",
    },
    iconColor: "#d97706",
  },
  CRITICA: {
    label: "Crítica",
    badgeStyle: {
      backgroundColor: "#ffe4e6",
      color: "#9f1239",
      borderColor: "#fda4af",
    },
    accentStyle: {
      backgroundColor: "#f43f5e",
    },
    iconStyle: {
      backgroundColor: "#fff1f2",
      borderColor: "#fda4af",
    },
    iconColor: "#e11d48",
  },
};

export function ProcessTreeNode({ data }: NodeProps<ProcessTreeNodeModel>) {
  const priority = priorityBadgeStyle[data.priority];
  const isActive = data.status === "ACTIVE";
  const isManual = data.type === "MANUAL";

  return (
    <div className="w-[220px] max-w-[220px] cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-card !bg-slate-400"
      />

      <div className="h-1 rounded-t-xl" style={priority.accentStyle} />

      <div className="flex w-[220px] max-w-[220px] flex-col gap-4 p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md border"
            style={priority.iconStyle}
          >
            {isManual ? (
              <Hand className="h-4 w-4" style={{ color: priority.iconColor }} />
            ) : (
              <Bot className="h-4 w-4" style={{ color: priority.iconColor }} />
            )}
          </div>

          <div className="min-w-0 flex flex-col">
            <span className="break-words text-sm font-semibold leading-snug text-foreground">
              {data.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {isManual ? "Manual" : "Sistêmico"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-xs font-medium"
            style={priority.badgeStyle}
          >
            {priority.label}
          </Badge>

          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {isActive ? "Ativo" : "Inativo"}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-card !bg-slate-400"
      />
    </div>
  );
}
