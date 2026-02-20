export type ProcessType = "MANUAL" | "SISTEMIC";
export type ProcessStatus = "ACTIVE" | "INACTIVE";
export type ProcessPriority = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export interface Process {
  id: string;
  name: string;
  description?: string;
  type: ProcessType;
  priority: ProcessPriority;
  status: ProcessStatus;
  areaId: string;
  parentId?: string;
  level: number;

  tools?: string[];
  responsibles?: string[];
  documentations?: string[];

  area?: {
    id: string;
    name: string;
    color?: string;
  };
  parent?: {
    id: string;
    name: string;
  };

  _count?: {
    children: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ProcessesResponse {
  data: Process[];
  meta: {
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
    page: number;
    totalPages: number;
  };
}

export interface CreateProcessDto {
  name: string;
  description?: string;
  type: ProcessType;
  priority: ProcessPriority;
  status?: ProcessStatus;
  areaId: string;
  parentId?: string;
  tools?: string[];
  responsibles?: string[];
  documentations?: string[];
}

export type UpdateProcessDto = Partial<CreateProcessDto>;
