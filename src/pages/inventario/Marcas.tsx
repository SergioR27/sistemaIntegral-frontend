import { obtenerMarcas, handleSave, handleDelete, updateMarca } from "@/functions/ActionsMarcas";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import { useAlert } from "@/components/AlertContext";
import { useState, useMemo, useEffect } from "react";
import Form from "@/components/Form";

type Marca = {
  id_marca: number,
  nombre_marca: string
};

export default function Marcas() {

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaEditando, setMarcaEditando] = useState<Marca | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { showAlert } = useAlert();


  const camposFormulario = useMemo(() => [
    { name: "nombre_marca", label: "Nombre de la Marca ", placeholder: "Ej: Dell", type: "text", required: true },
  ], []);

  const cargarMarcas = async () => {
    const res = await obtenerMarcas();

    if (res.success) {
      setMarcas(res.data)
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, []);


  const columns: Column<Marca>[] = [
    {
      key: "nombre_marca",
      label: "Marca",
      searchableValue: (p) =>
        `${p.nombre_marca}`,
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-normal text-sm text-foreground">
            {p.nombre_marca}
          </span>
        </div>
      ),
    },

  ];

  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {

      await showAlert("success", result.message, "Éxito");
      await cargarMarcas();


    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  const eliminarMarca = async (id: number) => {
    const confirmed = await showAlert(
      "delete",
      "¿Deseas eliminar esta marca?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await handleDelete(id);

    if (result.success) {

      await showAlert("success", result.message, "Eliminado");
      await cargarMarcas();

    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  return (

    <div className="grid ggrid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-2">
        <Form
          key={formKey}
          title={marcaEditando ? "Editar Marca" : "Agregar Marca"}
          fields={camposFormulario}
          columns={1}
          defaultValues={
            marcaEditando
              ? {
                nombre_marca: marcaEditando.nombre_marca,
              }
              : {}
          }
          onSubmit={async (values) => {

            let result;

            if (marcaEditando) {
              result = await executeAction(
                updateMarca(marcaEditando.id_marca, values)
              );

            } else {
              result = await executeAction(handleSave(values));
              if (result.success) {
                setFormKey(prev => prev + 1); // esto reinicia el form
              }


            }

            if (result.success) {
              setMarcaEditando(null);
              setFormKey(prev => prev + 1);
            }

          }}
        />

      </div>
      <div className="">
        <DataTable<Marca>
          titulo="Marcas Registradas"
          columns={columns}
          data={marcas}
          onEdit={(row) => {
            setMarcaEditando(row);
            setFormKey(prev => prev + 1); // fuerza recarga del form
          }}
          onDelete={(row) => eliminarMarca(row.id_marca)}

        />
      </div>
    </div>

  );
} 