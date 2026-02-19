"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { Textarea } from "../../../shared/components/ui/textarea";
import {
  CreateAreaFormData,
  createAreaSchema,
  UpdateAreaFormData,
  updateAreaSchema,
} from "../lib/validations/area";
import type { Area } from "../types";

interface AreaFormProps {
  area?: Area;
  onSubmit: (
    data: CreateAreaFormData | UpdateAreaFormData,
    setError: unknown,
  ) => void;
  loading?: boolean;
}

export function AreaForm({ area, onSubmit, loading }: AreaFormProps) {
  const form = useForm<CreateAreaFormData | UpdateAreaFormData>({
    resolver: zodResolver(area ? updateAreaSchema : createAreaSchema),
    defaultValues: {
      name: area?.name || "",
      description: area?.description || "",
      color: area?.color || "#f59e0b",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, form.setError))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Recursos Humanos" {...field} />
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
                <Textarea placeholder="Descreva a área..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input type="color" {...field} className="w-20 h-10" />
                </FormControl>
                <FormControl>
                  <Input {...field} placeholder="#f59e0b" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : area ? "Atualizar" : "Criar Área"}
        </Button>
      </form>
    </Form>
  );
}
