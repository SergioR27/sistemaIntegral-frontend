import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import { useAlert } from "@/components/AlertContext";
import { useState, useMemo, useEffect } from "react";
import Form from "@/components/Form";
import { obtenerTiposEquipamientos, handleSave, handleDelete, updateTipoEquipamiento } from "@/functions/ActionsTiposEquipamientos";

type tiposEquipamiento = {
  id_tipo_equipamiento: number,
  nombre_tipo: string,
}

export default function TiposEquipamiento() {

  const [tipoEquipamiento, setTipoEquipamiento] = useState<tiposEquipamiento[]>([]);
  const [tipoEquipamientoEditando, setTipoEquipamientoEditando] = useState<tiposEquipamiento | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { showAlert } = useAlert();

  const camposFormulario = useMemo(() => [
    { name: "nombre_tipo", label: "Nombre del tipo de Equipamiento ", placeholder: "Tipo Equipamiento", type: "text", required: true },
  ], []);

  const cargarTipoEquipamiento = async () => {
    const res = await obtenerTiposEquipamientos();

    if (res.success) {
      setTipoEquipamiento(res.data)
    }
  };

  useEffect(() => {
    cargarTipoEquipamiento();
  }, []);


  const columns: Column<tiposEquipamiento>[] = [
    {
      key: "nombre_marca",
      label: "Marca",
      searchableValue: (p) =>
        `${p.nombre_tipo}`,
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-normal text-sm text-foreground">
            {p.nombre_tipo}
          </span>
        </div>
      ),
    },

  ];

  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {

      await showAlert("success", result.message, "Éxito");
      await cargarTipoEquipamiento();


    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  const eliminarMarca = async (id: number) => {
    const confirmed = await showAlert(
      "delete",
      "¿Deseas eliminar este Tipo de Equipo?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await handleDelete(id);

    if (result.success) {

      await showAlert("success", result.message, "Eliminado");
      await cargarTipoEquipamiento();

    } else {
      await showAlert("error", result.message, "Error");
    }
  };


  return (
    <div className="grid ggrid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-2">
        <Form
          key={formKey}
          title={tipoEquipamientoEditando ? "Editar Tipo Equipamiento" : "Agregar Tipo Equipamiento"}
          fields={camposFormulario}
          columns={1}
          defaultValues={
            tipoEquipamientoEditando
              ? {
                nombre_tipo: tipoEquipamientoEditando.nombre_tipo,
              }
              : {}
          }
          onSubmit={async (values) => {

            let result;

            if (tipoEquipamientoEditando) {
              result = await executeAction(
                updateTipoEquipamiento(tipoEquipamientoEditando.id_tipo_equipamiento, values)
              );

            } else {
              result = await executeAction(handleSave(values));
              if (result.success) {
                setFormKey(prev => prev + 1); // esto reinicia el form
              }


            }

            if (result.success) {
              setTipoEquipamientoEditando(null);
              setFormKey(prev => prev + 1);
            }

          }}
        />

      </div>
      <div className="">
        <DataTable<tiposEquipamiento>
          titulo="Marcas Registradas"
          columns={columns}
          data={tipoEquipamiento}
          onEdit={(row) => {
            setTipoEquipamientoEditando(row);
            setFormKey(prev => prev + 1); // fuerza recarga del form
          }}
          onDelete={(row) => eliminarMarca(row.id_tipo_equipamiento)}

        />
      </div>
    </div>
  );
}