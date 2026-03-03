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

export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: import.meta.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    if (!res.ok) {
      console.error(`Turnstile verification failed with status: ${res.status}`);
      return false;
    }

    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
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
