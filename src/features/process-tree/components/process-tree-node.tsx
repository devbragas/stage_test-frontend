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
    <div className="min-w-[260px] max-w-[280px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_8px_24px_rgba(15,23,42,0.10)]">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-card !bg-slate-400"
      />

      <div className="h-1 w-full" style={priority.accentStyle} />

      <div className="space-y-3 px-3.5 py-3.5">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
            style={priority.iconStyle}
          >
            {isManual ? (
              <Hand className="h-4 w-4" style={{ color: priority.iconColor }} />
            ) : (
              <Bot className="h-4 w-4" style={{ color: priority.iconColor }} />
            )}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
              {data.name}
            </p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              {isManual ? "Manual" : "Sistêmico"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <Badge
            variant="outline"
            className="rounded-md border px-2 py-0.5 text-[11px] font-semibold"
            style={priority.badgeStyle}
          >
            {priority.label}
          </Badge>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-600"
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
