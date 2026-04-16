export const prerender = false;

import { sendEnrollmentEmail } from "@/lib/email";
import { verifyTurnstile } from "@/lib/utils/form-utils";
import type { APIRoute } from "astro";
import { z } from "zod/v3";

// Limites seguros
const MAX_FIELDS = 30;
const MAX_KEY_LENGTH = 100;
const MAX_VALUE_LENGTH = 3000;

// Schema principal
const dynamicFormSchema = z
  .record(
    z.string().max(MAX_KEY_LENGTH, "Nome do campo muito longo"),
    z.string().max(MAX_VALUE_LENGTH, "Valor excede o limite permitido"),
  )
  .refine((data) => Object.keys(data).length <= MAX_FIELDS, {
    message: "Número máximo de campos excedido",
  });

// Schema das labels COM OS LIMITES
const fieldLabelsSchema = z
  .record(z.string().max(MAX_KEY_LENGTH), z.string().max(MAX_VALUE_LENGTH))
  .refine((data) => Object.keys(data).length <= MAX_FIELDS, {
    message: "Número máximo de labels excedido",
  });

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return new Response(JSON.stringify({ success: false }), { status: 415 });
  }

  try {
    const formData = await request.formData();

    const raw: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      raw[key] = String(value);
    }

    const parsed = dynamicFormSchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, error: "Dados inválidos enviados no formulário." }), {
        status: 400,
      });
    }

    const parsedData = parsed.data;

    if (parsedData._honey) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const turnstileToken = parsedData._turnstile;
    if (!turnstileToken) {
      return new Response(JSON.stringify({ success: false, error: "Verificação de segurança ausente." }), {
        status: 400,
      });
    }

    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return new Response(JSON.stringify({ success: false, error: "Verificação de segurança falhou." }), {
        status: 400,
      });
    }

    const { _honey, _fieldLabels, _turnstile, ...fields } = parsedData;

    let fieldLabels: Record<string, string> = {};
    try {
      const trimmedLabels = _fieldLabels?.trim();
      if (trimmedLabels) {
        const parsedJson = JSON.parse(trimmedLabels);
        fieldLabels = fieldLabelsSchema.parse(parsedJson);
      }
    } catch {
      console.warn("Aviso: _fieldLabels ignorado devido a formato inválido.");
    }

    await sendEnrollmentEmail({ fields, fieldLabels });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to process enrollment:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};
