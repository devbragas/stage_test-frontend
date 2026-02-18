import { z } from "zod";

export const createAreaSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor inválida")
    .default("#f59e0b"),
});

export const updateAreaSchema = createAreaSchema.partial();

export type CreateAreaFormData = z.infer<typeof createAreaSchema>;
export type UpdateAreaFormData = z.infer<typeof updateAreaSchema>;
