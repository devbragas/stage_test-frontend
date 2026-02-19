"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/components/ui/form";
import { Input } from "@/src/shared/components/ui/input";
import { Textarea } from "@/src/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Separator } from "@/src/shared/components/ui/separator";
import {
  CreateProcessFormData,
  createProcessSchema,
  UpdateProcessFormData,
  updateProcessSchema,
} from "../lib/validations/process";
import { Process } from "../types/process";
import type { Area } from "@/src/features/areas";

interface ProcessFormProps {
  process?: Process;
  areas: Area[];
  processes: Process[];
  onSubmit: (data: CreateProcessFormData | UpdateProcessFormData) => void;
  loading?: boolean;
}

export function ProcessForm({
  process,
  areas,
  processes,
  onSubmit,
  loading,
}: ProcessFormProps) {
  const normalizedTools = (process?.tools || []).map((tool) => tool.trim());

  const normalizedResponsibles = (process?.responsibles || []).map(
    (responsible) => responsible.trim(),
  );
  const normalizedPriority = process?.priority || "MEDIA";

  const normalizedDocumentations = (process?.documentations || []).map(
    (documentation) => documentation.trim(),
  );

  const form = useForm<CreateProcessFormData | UpdateProcessFormData>({
    resolver: zodResolver(process ? updateProcessSchema : createProcessSchema),
    defaultValues: {
      name: process?.name || "",
      description: process?.description || "",
      type: process?.type || "MANUAL",
      priority: normalizedPriority,
      status: process?.status || "ATIVO",
      areaId: process?.areaId || "",
      parentId: process?.parentId || undefined,
      tools: normalizedTools,
      responsibles: normalizedResponsibles,
      documentations: normalizedDocumentations,
    },
  });

  const selectedAreaId = form.watch("areaId");

  const availableParentProcesses = processes.filter(
    (p) => p.areaId === selectedAreaId && p.id !== process?.id,
  );

  const tools = form.watch("tools") || [];

  const responsibles = form.watch("responsibles") || [];

  const documentations = form.watch("documentations") || [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          const { parentId, responsibles, tools, documentations, ...rest } =
            data;
          const formattedResponsibles = (responsibles || [])
            .map((responsible) =>
              typeof responsible === "string" ? responsible.trim() : "",
            )
            .filter(Boolean);
          const formattedTools = (tools || [])
            .map((tool) => (typeof tool === "string" ? tool.trim() : ""))
            .filter(Boolean);
          const formattedDocumentations = (documentations || [])
            .map((documentation) =>
              typeof documentation === "string" ? documentation.trim() : "",
            )
            .filter(Boolean);

          const formattedData = {
            ...rest,
            tools: formattedTools,
            responsibles: formattedResponsibles,
            documentations: formattedDocumentations,
            ...(parentId && parentId !== "NONE" ? { parentId } : {}),
          };

          onSubmit(formattedData);
        })}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <div className="min-w-0 space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Processo*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Recrutamento e Seleção"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o processo..."
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MANUAL">👤 Manual</SelectItem>
                        <SelectItem value="SISTEMIC">⚙️ Sistêmico</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BAIXA">Baixa</SelectItem>
                        <SelectItem value="MEDIA">Média</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="CRITICA">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processo Pai (Opcional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "NONE" ? undefined : value)
                    }
                    value={field.value ?? "NONE"}
                    defaultValue={field.value}
                    disabled={!selectedAreaId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhum (processo raiz)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">
                        Nenhum (processo raiz)
                      </SelectItem>
                      {availableParentProcesses.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {!selectedAreaId
                      ? "Selecione uma área primeiro"
                      : "Transformar em subprocesso de outro processo"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="min-w-0 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  Ferramentas Utilizadas
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    form.setValue("tools", [...tools, ""], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Ferramenta
                </Button>
              </div>

              {tools.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma ferramenta adicionada
                </p>
              )}

              {tools.map((_, index) => (
                <div key={`tool-${index}`} className="flex items-start gap-2">
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`tools.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Nome (ex: Trello)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updated = tools.filter((_, i) => i !== index);
                      form.setValue("tools", updated, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Responsáveis</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    form.setValue("responsibles", [...responsibles, ""], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Responsável
                </Button>
              </div>

              {responsibles.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum responsável adicionado
                </p>
              )}

              {responsibles.map((_, index) => (
                <div
                  key={`responsible-${index}`}
                  className="flex items-start gap-2"
                >
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`responsibles.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updated = responsibles.filter(
                        (_, i) => i !== index,
                      );
                      form.setValue("responsibles", updated, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Documentação</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    form.setValue("documentations", [...documentations, ""], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar URL
                </Button>
              </div>

              {documentations.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma documentação adicionada
                </p>
              )}

              {documentations.map((_, index) => (
                <div key={`documentation-${index}`} className="flex items-start gap-2">
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`documentations.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="URL da documentação" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updated = documentations.filter(
                        (_, i) => i !== index,
                      );
                      form.setValue("documentations", updated, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Salvando..." : process ? "Atualizar" : "Criar Processo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
