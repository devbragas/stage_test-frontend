import type { CSSProperties } from "react";

export const DROP_TARGET_OVERLAP_THRESHOLD = 0.08;

export const PROCESS_STATUS_BADGE_STYLES: Record<
  "ACTIVE" | "INACTIVE",
  CSSProperties
> = {
  ACTIVE: {
    backgroundColor: "#dcfce7",
  },
  INACTIVE: {
    backgroundColor: "#64748b6",
  },
};

