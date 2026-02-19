import { z } from "zod";

const toolSchema = z.string().trim().min(1, "Nome da ferramenta é obrigatório");

const responsibleSchema = z
  .string()
  .trim()
  .min(1, "Nome do responsável é obrigatório");

const documentationSchema = z.string().trim().url("URL inválida");

export const createProcessSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(200, "Nome muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  type: z.enum(["MANUAL", "SISTEMIC"], {
    error: "Selecione o tipo do processo",
  }),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).default("MEDIA"),
  areaId: z.string().uuid("Área inválida"),
  parentId: z.string().uuid("Processo pai inválido").optional(),
  tools: z.array(toolSchema).optional(),
  responsibles: z.array(responsibleSchema).optional(),
  documentations: z.array(documentationSchema).optional(),
});

export const updateProcessSchema = createProcessSchema.partial();

export type CreateProcessFormData = z.infer<typeof createProcessSchema>;
export type UpdateProcessFormData = z.infer<typeof updateProcessSchema>;
