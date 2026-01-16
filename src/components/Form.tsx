import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Field = {
  name: string;
  label: string;
  type: "text" | "select" | "file";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  colSpan?: number; // 👈 NUEVO
};

type FormProps = {
  title?: string;
  fields: Field[];
  columns?: 1 | 2 | 3 | 4;
  onSubmit?: (values: Record<string, any>) => void;
};

export default function Form({
  title,
  fields,
  columns = 2,
  onSubmit,
}: FormProps) {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const values = Object.fromEntries(data.entries());

    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {title && (
        <h2 className="text-xl font-semibold">{title}</h2>
      )}

      {/* GRID RESPONSIVO */}
      <div
        className={`
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-${columns}
        `}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={`space-y-1 ${field.colSpan ? `lg:col-span-${field.colSpan}` : ""
              }`}
          >
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {/* TEXT */}
            {field.type === "text" && (
              <Input
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}

            {/* FILE */}
            {field.type === "file" && (
              <Input
                type="file"
                name={field.name}
                required={field.required}
              />
            )}

            {/* SELECT */}
            {field.type === "select" && (
              <Select name={field.name}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="submit"
          className="bg-primario text-white hover:bg-primario-dark"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
