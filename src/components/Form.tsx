import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

/* =========================
   TIPOS
========================= */

type FieldType =
  | "text"
  | "email"
  | "select"
  | "file"
  | "checkbox"
  | "number"
  | (string & {});

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  colSpan?: number;
  defaultChecked?: boolean;
};

type FormValues = Record<string, any>;

type SubmitResponse = {
  success: boolean;
  message?: string;
};

type FormProps = {
  title?: string;
  fields: Field[];
  columns?: 1 | 2 | 3 | 4;
  defaultValues?: Record<string, any>;
  onSubmit: (values: FormValues) => Promise<void>;
};

/* =========================
   MAPAS TAILWIND
========================= */

const gridColsMap = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const colSpanMap = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};




/* =========================
   COMPONENTE
========================= */



export default function Form({
  title,
  fields,
  columns = 2,
  defaultValues,
  onSubmit,
}: FormProps) {
  // const [selectValues, setSelectValues] = useState<Record<string, any>>({});
  // const [loading, setLoading] = useState(false);

  // const [selectValues, setSelectValues] = useState<Record<string, any>>(
  //   defaultValues || {}
  // );

  const [selectValues, setSelectValues] = useState<Record<string, any>>(
    Object.fromEntries(
      Object.entries(defaultValues || {}).map(([k, v]) => [k, String(v)])
    )
  );

  const [formValues, setFormValues] = useState(defaultValues || {});

  const [loading, setLoading] = useState(false);

  const isEditing = defaultValues && Object.keys(defaultValues).length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    setLoading(true);
    await onSubmit(values);
    setLoading(false);
  };


  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
      case "number":
      case "email":
        return (
          <Input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={defaultValues?.[field.name] ?? ""}
            required={field.required}
          />
        );

      case "file":
        return <Input type="file" name={field.name} />;

      case "select":
        return (
          <>
            <Select
              value={selectValues[field.name] ?? ""}
              onValueChange={(value) =>
                setSelectValues((prev) => ({
                  ...prev,
                  [field.name]: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>

              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="hidden"
              name={field.name}
              value={selectValues[field.name] ?? ""}
              required={field.required}
            />
          </>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              name={field.name}
              checked={formValues[field.name] || false}
              onCheckedChange={(checked) =>
                setFormValues((prev) => ({
                  ...prev,
                  [field.name]: checked,
                }))
              }
            />
            <span className="text-base text-muted-foreground">
              {field.label}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (defaultValues) {
      setSelectValues(
        Object.fromEntries(
          Object.entries(defaultValues).map(([k, v]) => [k, String(v)])
        )
      );
    }
  }, [defaultValues]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}

        <div
          className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${gridColsMap[columns]
            }`}
        >
          {fields.map((field) => (
            <div
              key={field.name}
              className={`space-y-2 ${field.colSpan
                ? colSpanMap[field.colSpan as 1 | 2 | 3 | 4]
                : ""
                }`}
            >
              {field.type !== "checkbox" && (
                <label className="text-base text-mist-600">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
              )}

              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {/* <Button
            type="submit"
            disabled={loading}
            className="bg-primario text-white hover:bg-primario-dark"
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button> */}

          <Button
            type="submit"
            disabled={loading}
            className={`text-white ${isEditing
              ? "bg-camel hover:bg-secundario"
              : "bg-primario hover:bg-primario-dark"
              }`}
          >
            {loading
              ? isEditing
                ? "Actualizando..."
                : "Guardando..."
              : isEditing
                ? "Actualizar"
                : "Guardar"}
          </Button>
        </div>
      </form>
    </>
  );
}