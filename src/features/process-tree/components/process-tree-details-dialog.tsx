"use client";

import { Bot, Hand } from "lucide-react";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import type { ProcessTreeNode as ProcessTreeNodeModel } from "../types";
import { PROCESS_STATUS_BADGE_STYLES } from "./process-tree-flow.constants";

interface ProcessTreeDetailsDialogProps {
  open: boolean;
  node: ProcessTreeNodeModel | null;
  areaName?: string;
  onOpenChange: (open: boolean) => void;
  selectedNodeHasChildren: boolean;
  selectedNodeChildrenCount: number;
  isDeleteDialogOpen: boolean;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onDeleteClick: () => void;
  onConfirmDelete: () => void;
  deletePending: boolean;
  updatePending: boolean;
}

export function ProcessTreeDetailsDialog({
  open,
  node,
  areaName,
  onOpenChange,
  selectedNodeHasChildren,
  selectedNodeChildrenCount,
  isDeleteDialogOpen,
  onDeleteDialogOpenChange,
  onDeleteClick,
  onConfirmDelete,
  deletePending,
  updatePending,
}: ProcessTreeDetailsDialogProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg !p-0">
          <div className="px-1.5 py-3.5">
            <DialogHeader className="mb-4">
              <DialogTitle>Detalhes do Processo</DialogTitle>
            </DialogHeader>

            {node && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-border/70 px-4 py-4">
                  <div className="mt-0.5 text-muted-foreground">
                    {node.data.type === "MANUAL" ? (
                      <Hand className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="text-base font-semibold text-foreground">
                      {node.data.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="mt-1 text-sm font-medium">
                      {node.data.type === "MANUAL" ? "Manual" : "Sistêmico"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <Badge style={PROCESS_STATUS_BADGE_STYLES[node.data.status]}>
                        {node.data.status === "ACTIVE" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Área</p>
                    <p className="mt-1 text-sm font-medium">{areaName || "-"}</p>
                  </div>

                  <div className="rounded-lg border border-border/70 px-4 py-4">
                    <p className="text-xs text-muted-foreground">Profundidade</p>
                    <p className="mt-1 text-sm font-medium">
                      Nível {node.data.depth}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/70 px-4 py-4">
                  <p className="text-xs text-muted-foreground">Descrição</p>
                  <p className="mt-1 text-sm text-foreground">
                    {node.data.description?.trim() || "Sem descrição informada."}
                  </p>
                </div>

                {selectedNodeHasChildren && (
                  <p className="text-xs font-medium text-destructive">
                    Este processo possui {selectedNodeChildrenCount} subprocesso(s)
                    e não pode ser excluído.
                  </p>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDeleteClick}
                    disabled={deletePending || updatePending}
                  >
                    {deletePending ? "Excluindo..." : "Excluir processo"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar este processo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={deletePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

