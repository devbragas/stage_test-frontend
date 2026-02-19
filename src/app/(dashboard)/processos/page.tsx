"use client";

import {
  Plus,
  Workflow,
  Pencil,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bot,
  Hand,
} from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Badge } from "@/src/shared/components/ui/badge";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { Input } from "@/src/shared/components/ui/input";
import {
  useProcesses,
  useCreateProcess,
  useUpdateProcess,
  useDeleteProcess,
} from "@/src/features/processes/hooks/useProcesses";
import { useAreas } from "@/src/features/areas/hooks/useAreas";
import { useProcessStore } from "@/src/features/processes/lib/store/process-store";
import { ProcessForm } from "@/src/features/processes/components/process-form";
import {
  CreateProcessFormData,
  UpdateProcessFormData,
} from "@/src/features/processes/lib/validations/process";

const statusColors = {
  ATIVO: "bg-green-100 text-green-800",
  EM_REVISAO: "bg-yellow-100 text-yellow-800",
  DESCONTINUADO: "bg-red-100 text-red-800",
};

const priorityBadgeStyles = {
  BAIXA: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    borderColor: "#cbd5e1",
  },
  MEDIA: {
    backgroundColor: "#e0f2fe",
    color: "#075985",
    borderColor: "#7dd3fc",
  },
  ALTA: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderColor: "#fcd34d",
  },
  CRITICA: {
    backgroundColor: "#ffe4e6",
    color: "#9f1239",
    borderColor: "#fda4af",
  },
};

const priorityCardColors = {
  BAIXA: "border-l-4 border-l-gray-400 bg-gray-50/40",
  MEDIA: "border-l-4 border-l-blue-500 bg-blue-50/40",
  ALTA: "border-l-4 border-l-orange-500 bg-orange-50/40",
  CRITICA: "border-l-4 border-l-red-500 bg-red-50/40",
};

const typeIcons = {
  MANUAL: (
    <Hand
      size={24}
      strokeWidth={2.5}
      className="text-purple-600 dark:text-purple-400"
    />
  ),
  SISTEMIC: (
    <Bot
      size={24}
      strokeWidth={2.5}
      className="text-purple-600 dark:text-purple-400"
    />
  ),
};

export default function ProcessesPage() {
  const createProcess = useCreateProcess();
  const updateProcess = useUpdateProcess();
  const deleteProcess = useDeleteProcess();

  const {
    selectedProcess,
    selectedAreaId,
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    search,
    page,
    limit,
    setSearch,
    setSelectedAreaId,
    setPage,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = useProcessStore();

  const { data: response, isLoading } = useProcesses({
    search,
    areaId: selectedAreaId || undefined,
    page,
    limit,
  });

  const { data: areas } = useAreas();

  const processes = response?.data || [];
  const meta = response?.meta;

  const handleCreate = (data: CreateProcessFormData) => {
    createProcess.mutate(data, {
      onSuccess: () => closeCreateDialog(),
    });
  };

  const handleUpdate = (data: UpdateProcessFormData) => {
    if (!selectedProcess) return;
    updateProcess.mutate(
      { id: selectedProcess.id, data },
      {
        onSuccess: () => closeEditDialog(),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedProcess) return;
    deleteProcess.mutate(selectedProcess.id, {
      onSuccess: () => closeDeleteDialog(),
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Processos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie processos e subprocessos organizacionais
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar processo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={selectedAreaId || "all"}
            onValueChange={(value) =>
              setSelectedAreaId(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Todas as áreas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {areas?.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="lg" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && processes.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16">
          <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Nenhum processo encontrado</CardTitle>
          <Button onClick={openCreateDialog} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Criar Processo
          </Button>
        </Card>
      )}

      {!isLoading && processes.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processes.map((process) => (
              <Card
                key={process.id}
                className={`hover:shadow-lg transition-shadow ${priorityCardColors[process.priority]}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {typeIcons[process.type]}
                        </span>
                        <CardTitle className="text-lg">
                          {process.name}
                        </CardTitle>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={statusColors[process.status]}>
                          {process.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          style={priorityBadgeStyles[process.priority]}
                        >
                          {process.priority === "MEDIA"
                            ? "Média"
                            : process.priority === "CRITICA"
                              ? "Crítica"
                              : process.priority}
                        </Badge>
                        {process.area && (
                          <Badge
                            variant="outline"
                            style={{ borderColor: process.area.color }}
                          >
                            {process.area.name}
                          </Badge>
                        )}
                        {process.parent && (
                          <Badge variant="secondary">Subprocesso</Badge>
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
                        <DropdownMenuItem
                          onClick={() => openEditDialog(process)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(process)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                {process.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {process.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {meta.skip + 1} -{" "}
                {Math.min(meta.skip + meta.limit, meta.total)} de {meta.total}{" "}
                processo(s)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.totalPages ||
                        Math.abs(p - page) <= 1,
                    )
                    .map((p, i, arr) => (
                      <div key={p} className="flex items-center">
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant={p === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                          className="min-w-[40px]"
                        >
                          {p}
                        </Button>
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={!meta.hasMore}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={closeCreateDialog}>
        <DialogContent className="w-[96vw] sm:max-w-4xl max-w-7xl max-h-[92vh] overflow-y-auto overflow-x-hidden !p-0">
          <div className="px-6 pt-6 pb-5 md:px-8 md:pt-7 md:pb-6">
            <DialogHeader className="pr-10 pb-4.5 mb-1.5">
              <DialogTitle>Criar Novo Processo</DialogTitle>
              <DialogDescription>
                Adicione um novo processo ou subprocesso
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5">
              <ProcessForm
                areas={areas || []}
                processes={processes || []}
                onSubmit={handleCreate}
                loading={createProcess.isPending}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="w-[96vw] sm:max-w-4xl max-w-7xl overflow-y-auto overflow-x-hidden !p-0">
          <div className="px-6 pt-6 pb-5 md:px-8 md:pt-7 md:pb-6">
            <DialogHeader className="pr-10">
              <DialogTitle>Editar Processo</DialogTitle>
            </DialogHeader>
            <div className="mt-5">
              <ProcessForm
                process={selectedProcess || undefined}
                areas={areas || []}
                processes={processes || []}
                onSubmit={handleUpdate}
                loading={updateProcess.isPending}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar este processo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
              {selectedProcess?._count?.children &&
                selectedProcess._count.children > 0 && (
                  <span className="block mt-2 text-destructive font-semibold">
                    ⚠️ Este processo possui {selectedProcess._count.children}{" "}
                    subprocesso(s).
                  </span>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteProcess.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProcess.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
