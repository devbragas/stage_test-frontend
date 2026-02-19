// src/features/processes/lib/store/process-store.ts
import { create } from "zustand";
import { Process } from "../../types/process";

interface ProcessStore {
  selectedProcess: Process | null;
  selectedAreaId: string | null;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  search: string;
  page: number;
  limit: number;

  setSearch: (value: string) => void;
  setSelectedProcess: (process: Process | null) => void;
  setSelectedAreaId: (areaId: string | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openEditDialog: (process: Process) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (process: Process) => void;
  closeDeleteDialog: () => void;
}

export const useProcessStore = create<ProcessStore>((set) => ({
  selectedProcess: null,
  selectedAreaId: null,
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  search: "",
  page: 1,
  limit: 20,

  setSearch: (value) => set({ search: value, page: 1 }), // ✅ Reset page ao buscar
  setSelectedProcess: (process) => set({ selectedProcess: process }),
  setSelectedAreaId: (areaId) => set({ selectedAreaId: areaId, page: 1 }), // ✅ Reset page ao filtrar
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }), // ✅ Reset page ao mudar limit
  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () => set({ isCreateDialogOpen: false }),
  openEditDialog: (process) =>
    set({ selectedProcess: process, isEditDialogOpen: true }),
  closeEditDialog: () =>
    set({ isEditDialogOpen: false, selectedProcess: null }),
  openDeleteDialog: (process) =>
    set({ selectedProcess: process, isDeleteDialogOpen: true }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, selectedProcess: null }),
}));
