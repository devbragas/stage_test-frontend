import { api } from "@/src/lib/client";
import type { ProcessTreeItem } from "../types";

type ProcessTreeApiResponse = ProcessTreeItem[] | { data: ProcessTreeItem[] };

export async function getProcessTree(
  areaId: string,
  signal?: AbortSignal,
): Promise<ProcessTreeItem[]> {
  const { data } = await api.get<ProcessTreeApiResponse>(
    `/processes/area/${areaId}/tree`,
    { signal },
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}
