"use client";

import { Plus, Building2, Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../shared/components/ui/dropdown-menu";
import { Badge } from "../../../shared/components/ui/badge";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import {
  useAreas,
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
} from "../../../features/areas/hooks/useAreas";
import { useAreaStore } from "../../../features/areas/lib/store/area-store";
import { AreaForm } from "../../../features/areas/components/area-form";
import {
  CreateAreaFormData,
  UpdateAreaFormData,
} from "../../../features/areas/lib/validations/area";

export default function AreasPage() {
  const { data: areas, isLoading } = useAreas();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  const {
    selectedArea,
    isCreateDialogOpen,
    isEditDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
  } = useAreaStore();

  const handleCreate = (data: CreateAreaFormData) => {
    createArea.mutate(data, {
      onSuccess: () => closeCreateDialog(),
    });
  };

  const handleUpdate = (data: UpdateAreaFormData) => {
    if (!selectedArea) return;
    updateArea.mutate(
      { id: selectedArea.id, data },
      {
        onSuccess: () => closeEditDialog(),
      },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta área?")) return;
    deleteArea.mutate(id);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Áreas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os departamentos e setores da empresa
          </p>
        </div>

        <Button size="lg" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Área
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && areas?.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Nenhuma área cadastrada</CardTitle>
          <CardDescription>Comece criando sua primeira área</CardDescription>
          <Button onClick={openCreateDialog} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Criar Área
          </Button>
        </Card>
      )}

      {!isLoading && areas && areas.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Card
              key={area.id}
              className="relative hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${area.color}20` }}
                    >
                      <Building2
                        className="h-5 w-5"
                        style={{ color: area.color }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                      {area._count && (
                        <Badge variant="secondary" className="mt-1">
                          {area._count.processes} processos
                        </Badge>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(area)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(area.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {area.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {area.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={closeCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Área</DialogTitle>
            <DialogDescription>
              Adicione um novo departamento ou setor
            </DialogDescription>
          </DialogHeader>
          <AreaForm onSubmit={handleCreate} loading={createArea.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Área</DialogTitle>
          </DialogHeader>
          <AreaForm
            area={selectedArea || undefined}
            onSubmit={handleUpdate}
            loading={updateArea.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
