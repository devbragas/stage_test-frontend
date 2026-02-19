import { create } from "zustand";
import { Area } from "../../types/area";

interface AreaStore {
  selectedArea: Area | null;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  search: string;
  setSearch: (value: string) => void;
  setSelectedArea: (area: Area | null) => void;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openEditDialog: (area: Area) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (area: Area) => void;
  closeDeleteDialog: () => void;
}

export const useAreaStore = create<AreaStore>((set) => ({
  selectedArea: null,
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  search: "",
  setSearch: (value) => set({ search: value }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () => set({ isCreateDialogOpen: false }),
  openEditDialog: (area) => set({ selectedArea: area, isEditDialogOpen: true }),
  closeEditDialog: () => set({ isEditDialogOpen: false, selectedArea: null }),
  openDeleteDialog: (area) =>
    set({ selectedArea: area, isDeleteDialogOpen: true }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, selectedArea: null }),
}));
