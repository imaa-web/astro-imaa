import { z } from "zod/v3";

interface FieldOption {
  _key: string;
  label: string;
}

export interface SanityFormField {
  _key: string;
  fieldType: "input" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder?: string | null;
  inputType?: "text" | "email" | "tel" | "number" | null;
  required?: boolean | null;
  width?: "half" | "full" | null;
  options?: FieldOption[] | null;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}


export function buildFormSchema(fields: SanityFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const key = field._key;

    if (field.fieldType === "checkbox") {
      shape[key] = field.required
        ? z.boolean().refine((v) => v === true, { message: `${field.label} é obrigatório` })
        : z.boolean().optional();
    } else if ((field.fieldType === "select" || field.fieldType === "radio") && field.options?.length) {
      const allowedValues = field.options.map((opt) => opt.label) as [string, ...string[]];
      const enumSchema = z.enum(allowedValues);
      shape[key] = field.required ? enumSchema : enumSchema.or(z.literal(""));
    } else if (field.inputType === "email") {
      shape[key] = field.required
        ? z
            .string()
            .min(1, `${field.label} é obrigatório`)
            .email(`${field.label} inválido`)
            .max(200, "E-mail muito longo")
        : z.string().email(`${field.label} inválido`).max(200, "E-mail muito longo").or(z.literal(""));
    } else if (field.inputType === "number") {
      shape[key] = field.required
        ? z
            .string()
            .min(1, `${field.label} é obrigatório`)
            .max(50, "Número muito longo")
            .regex(/^\d+([.,]\d+)?$/, `${field.label} deve ser um número`)
        : z
            .string()
            .max(50, "Número muito longo")
            .regex(/^\d+([.,]\d+)?$/, `${field.label} deve ser um número`)
            .or(z.literal(""));
    } else {
      const maxLen = field.fieldType === "textarea" ? 3000 : 200;
      const baseSchema = z.string().max(maxLen, `${field.label} deve ter no máximo ${maxLen} caracteres`);
      shape[key] = field.required ? baseSchema.min(1, `${field.label} é obrigatório`) : baseSchema;
    }
  }

  return z.object(shape);
}
