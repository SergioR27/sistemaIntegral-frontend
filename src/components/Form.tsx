import { useState, useEffect, useRef } from "react";
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
  | "date"
  | "autocomplete"
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
  showPreview?: boolean;
  allowDeleteFile?: boolean;
  disabled?: boolean;
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
  // onSubmit: (values: FormValues) => Promise<void>;
  // onSubmit: (formData: FormData) => Promise<void>;
  onSubmit: (data: FormData | Record<string, any>) => Promise<void>;
  onChange?: (values: Record<string, any>) => void;
  hideSubmit?: boolean;
  onValidate?: (validateFn: () => boolean) => void;
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
  onChange,
  hideSubmit,
  onValidate,
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
  const [deletedFiles, setDeletedFiles] = useState<Record<string, boolean>>({});

  const isEditing = defaultValues && Object.keys(defaultValues).length > 0;

  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [openAutocomplete, setOpenAutocomplete] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // detectar si el form tiene archivos
    const hasFileField = fields.some((f) => f.type === "file");

    // const values = Object.fromEntries(formData.entries());
    setLoading(true);

    if (hasFileField) {
      // mandar multipart
      await onSubmit(formData);
    } else {
      // mandar JSON normal
      const values = Object.fromEntries(formData.entries());
      await onSubmit(values);
    }
    setLoading(false);
  };

  useEffect(() => {
    onValidate?.(() => formRef.current?.reportValidity() ?? true);
  }, [onValidate]);

  // const handleChange = (name: any, value: any) => {
  //   setFormValues((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (name: any, value: any) => {
    const updated = {
      ...formValues,
      [name]: value,
    };

    setFormValues(updated);

    // 👇 ESTO ES LO NUEVO
    onChange?.(updated);
  };

  const handleDeleteFile = (fieldName: string) => {
    setDeletedFiles((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    setFormValues((prev) => ({
      ...prev,
      [`${fieldName}_url`]: null,
      [fieldName]: null,
    }));
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
            onChange={(e) => handleChange(field.name, e.target.value)}
            disabled={field.disabled}
          />
        );

      case "file":
        const fileDeleted = deletedFiles[field.name];
        const hasPreview = field.showPreview;
        const allowDelete = field.allowDeleteFile;

        return (
          <div className="space-y-3">

            {hasPreview &&
              formValues?.[`${field.name}_url`] &&
              !fileDeleted ? (

              <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/40">

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 rounded-md px-2 py-1 text-xs font-bold">
                    PDF
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Documento actual</p>
                    <p className="text-muted-foreground text-xs">
                      Puedes visualizar o reemplazar el archivo
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={formValues[`${field.name}_url`]}
                    target="_blank"
                    className="px-3 py-1.5 text-sm rounded-md bg-primario text-white"
                  >
                    Ver
                  </a>

                  {allowDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(field.name)}
                      className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

              </div>

            ) : (

              <Input
                type="file"
                name={field.name}
                onChange={(e) =>
                  handleChange(field.name, e.target.files?.[0] || null)
                }
              />

            )}

          </div>
        );

      case "select":
        return (
          <>
            <Select
              value={formValues[field.name] ? String(formValues[field.name]) : ""}
              onValueChange={(value) => {
                const isNumber =
                  typeof field.options?.[0]?.value === "number";

                const finalValue = isNumber ? Number(value) : value;

                setSelectValues((prev) => ({
                  ...prev,
                  [field.name]: String(finalValue),
                }));

                handleChange(field.name, finalValue);
              }}
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
              required={field.required && !field.disabled}
            />
          </>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              name={field.name}
              checked={formValues[field.name] || false}
              disabled={field.disabled}
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

      case "date":
        return (
          <Input
            type="date"
            name={field.name}
            defaultValue={defaultValues?.[field.name] ?? ""}
            required={field.required}
            onChange={(e) => handleChange(field.name, e.target.value)}
            disabled={field.disabled}
          />
        );

      case "autocomplete":
        const search = searchValues[field.name] || "";
        const selectedValue = selectValues[field.name];

        const filteredOptions = field.options?.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        );

        const showOptions =
          openAutocomplete[field.name] && search.length >= 2;

        return (
          <div className="relative">
            {/* <Input
              type="text"
              placeholder="Escribe para buscar..."
              value={
                search ||
                field.options?.find(
                  (o) => String(o.value) === String(selectedValue)
                )?.label ||
                ""
              }
              onChange={(e) =>
                setSearchValues((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              onFocus={() =>
                setOpenAutocomplete((prev) => ({
                  ...prev,
                  [field.name]: true,
                }))
              }
              onBlur={() =>
                setTimeout(() => {
                  setOpenAutocomplete((prev) => ({
                    ...prev,
                    [field.name]: false,
                  }));
                }, 150)
              }
            /> */}

            <Input
              type="text"
              placeholder="Escribe para buscar..."
              value={searchValues[field.name] ?? ""}
              disabled={field.disabled}
              onChange={(e) =>
                setSearchValues((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              onFocus={() =>
                setOpenAutocomplete((prev) => ({
                  ...prev,
                  [field.name]: true,
                }))
              }
              onBlur={() =>
                setTimeout(() => {
                  setOpenAutocomplete((prev) => ({
                    ...prev,
                    [field.name]: false,
                  }));
                }, 150)
              }
            />

            {showOptions && (
              <div className="absolute z-50 bg-white dark:bg-oscuro-fondo border w-full max-h-60 overflow-y-auto rounded shadow">
                {filteredOptions?.length === 0 && (
                  <div className="p-2 text-gray-400">Sin resultados</div>
                )}

                {filteredOptions?.map((opt) => (
                  <div
                    key={opt.value}
                    className="p-2 hover:bg-red-100 dark:hover:bg-oscuro-menu  cursor-pointer"
                    onClick={() => {

                      const finalValue = typeof opt.value === "number" ? Number(opt.value) : opt.value;


                      setSelectValues((prev) => ({
                        ...prev,
                        [field.name]: String(opt.value),
                      }));

                      setSearchValues((prev) => ({
                        ...prev,
                        [field.name]: opt.label,
                      }));

                      setOpenAutocomplete((prev) => ({
                        ...prev,
                        [field.name]: false,
                      }));

                      handleChange(field.name, finalValue);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}

            <input
              type="hidden"
              name={field.name}
              value={selectedValue ?? ""}
              required={field.required && !field.disabled}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // useEffect(() => {
  //   if (defaultValues) {
  //     setSelectValues(
  //       Object.fromEntries(
  //         Object.entries(defaultValues).map(([k, v]) => [k, String(v)])
  //       )
  //     );
  //   }
  // }, [defaultValues]);

  // useEffect(() => {
  //   if (defaultValues && fields) {

  //     const newSelectValues: Record<string, any> = {};
  //     const newSearchValues: Record<string, string> = {};

  //     fields.forEach((field) => {

  //       if (field.type === "autocomplete" && field.options) {

  //         const value = defaultValues[field.name];

  //         if (value !== undefined && value !== null) {

  //           newSelectValues[field.name] = String(value);

  //           const option = field.options.find(
  //             (o) => String(o.value) === String(value)
  //           );

  //           if (option) {
  //             newSearchValues[field.name] = option.label;
  //           }

  //         }

  //       }

  //     });

  //     setSelectValues((prev) => ({ ...prev, ...newSelectValues }));
  //     setSearchValues((prev) => ({ ...prev, ...newSearchValues }));

  //   }
  // }, [defaultValues, fields]);

  useEffect(() => {

    if (!defaultValues) return;

    const newSelectValues: Record<string, any> = {};
    const newSearchValues: Record<string, string> = {};
    const newFormValues: Record<string, any> = {};

    fields.forEach((field) => {

      const value = defaultValues[field.name];

      if (value !== undefined && value !== null) {

        if (field.type === "autocomplete" || field.type === "select") {
          newSelectValues[field.name] = String(value);
        }

        if (field.type === "autocomplete" && field.options) {

          const option = field.options.find(
            (o) => String(o.value) === String(value)
          );

          if (option) {
            newSearchValues[field.name] = option.label;
          }

        }

        if (field.type === "checkbox") {
          newFormValues[field.name] = Boolean(value);
        }

      }

    });

    setSelectValues(newSelectValues);
    setSearchValues(newSearchValues);
    // setFormValues(newFormValues);

    setFormValues((prev) => ({
      ...prev,
      ...defaultValues,
      ...newFormValues,
    }));
  }, [defaultValues, fields]);

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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

          {!hideSubmit && (
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
          )}
        </div>
      </form>
    </>
  );
}