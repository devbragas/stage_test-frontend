export interface Area {
  id: string;
  name: string;
  description?: string;
  color?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    processes: number;
  };
}

export interface CreateAreaDto {
  name: string;
  description?: string;
  color?: string;
}

export type UpdateAreaDto = Partial<CreateAreaDto>;
