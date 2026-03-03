import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SanityFormField } from "@/lib/utils/form-utils";
import { Controller, type UseFormReturn } from "react-hook-form";

interface DynamicFieldProps {
  fieldDef: SanityFormField;
  form: UseFormReturn<Record<string, unknown>>;
}

export function DynamicField({ fieldDef, form }: Readonly<DynamicFieldProps>) {
  const inputId = `enrollment-${fieldDef._key}`;
  const requiredLabel = fieldDef.required ? " *" : "";

  return (
    <Controller
      name={fieldDef._key}
      control={form.control}
      render={({ field, fieldState }) => {
        switch (fieldDef.fieldType) {
          case "input":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId}>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value as string}
                  id={inputId}
                  type={fieldDef.inputType ?? "text"}
                  placeholder={fieldDef.placeholder ?? undefined}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "textarea":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId}>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value as string}
                  id={inputId}
                  placeholder={fieldDef.placeholder ?? undefined}
                  rows={3}
                  maxLength={3000}
                  className="resize-none"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "select":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId}>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <Select name={field.name} value={field.value as string} onValueChange={field.onChange}>
                  <SelectTrigger id={inputId} ref={field.ref} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={fieldDef.placeholder ?? undefined} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {(fieldDef.options ?? []).map((opt) => (
                      <SelectItem key={opt._key} value={opt.label}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "checkbox":
            return (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  id={inputId}
                  ref={field.ref}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor={inputId} className="font-normal cursor-pointer">
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "radio":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <RadioGroup
                  name={field.name}
                  value={field.value as string}
                  onValueChange={field.onChange}
                  ref={field.ref}
                  className="space-y-2 mt-1"
                >
                  {(fieldDef.options ?? []).map((opt) => (
                    <div key={opt._key} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={opt.label}
                        id={`${inputId}-${opt._key}`}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={`${inputId}-${opt._key}`} className="font-normal cursor-pointer">
                        {opt.label}
                      </FieldLabel>
                    </div>
                  ))}
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          default:
            return <></>;
        }
      }}
    />
  );
}
