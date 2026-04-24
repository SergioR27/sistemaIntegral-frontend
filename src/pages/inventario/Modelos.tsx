import { obtenerMarcas } from "@/functions/ActionsMarcas";
import { obtenerModelos, handleDelete, handleSave, updateModelo } from "@/functions/ActionsModelos";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import { useAlert } from "@/components/AlertContext";
import { useState, useMemo, useEffect } from "react";
import Form from "@/components/Form";

type Modelo = {
  id_modelo: number,
  sid_marca: number,
  nombre_modelo: string,
  marca: any
}

type Marca = {
  id_marca: number,
  nombre_marca: string
};

export default function Modelos() {

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [marcasModelo, setMarcasModelo] = useState<Marca[]>([]);
  const [modeloEditando, setModeloEditando] = useState<Modelo | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { showAlert } = useAlert();

  const cargarMarcasModelos = async () => {
    const res = await obtenerMarcas();
    if (res.success) {
      setMarcasModelo(res.data);
    }
  };

  const cargarModelos = async () => {
    const res = await obtenerModelos();

    if (res.success) {
      setModelos(res.data)
    }
  };

  useEffect(() => {
    cargarMarcasModelos();

    cargarModelos();

  }, []);


  const camposFormularioModelos = useMemo(() => [
    {
      name: "sid_marca",
      label: "Marca",
      type: "select",
      required: true,
      options: marcasModelo.map((a) => ({
        label: a.nombre_marca,
        value: a.id_marca
      })),
    },
    { name: "nombre_modelo", label: "Nombre del Modelo ", placeholder: "Nombre Modelo", type: "text", required: true },
  ], [marcasModelo]);

  const columns: Column<Modelo>[] = [
    {
      key: "nombre_modelo",
      label: "Modelo",
      searchableValue: (p) =>
        `${p.nombre_modelo} ${p.marca?.nombre_marca}`,
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {p.nombre_modelo}
          </span>
          <span className="text-xs text-gray-500">
            {p.marca?.nombre_marca || "Sin marca"}
          </span>
        </div>
      ),
    },
  ];

  const executeActionModelo = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {

      await showAlert("success", result.message, "Éxito");
      await cargarModelos();


    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  const eliminarModelo = async (id: number) => {
    const confirmed = await showAlert(
      "delete",
      "¿Deseas eliminar este modelo?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await handleDelete(id);

    if (result.success) {

      await showAlert("success", result.message, "Eliminado");
      await cargarModelos();

    } else {
      await showAlert("error", result.message, "Error");
    }
  };



  return (
    <div className="grid ggrid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-2">
        <Form
          key={formKey}
          title={modeloEditando ? "Editar Modelo" : "Agregar Modelo"}
          fields={camposFormularioModelos}
          columns={1}
          defaultValues={
            modeloEditando
              ? {
                nombre_modelo: modeloEditando.nombre_modelo,
                sid_marca: modeloEditando.sid_marca
              }
              : {}
          }
          onSubmit={async (values) => {

            let result;

            if (modeloEditando) {
              result = await executeActionModelo(
                updateModelo(modeloEditando.id_modelo, values)
              );

            } else {
              result = await executeActionModelo(handleSave(values));
              if (result.success) {
                setFormKey(prev => prev + 1); // esto reinicia el form
              }


            }

            if (result.success) {
              setModeloEditando(null);
              setFormKey(prev => prev + 1);
            }

          }}
        />

      </div>
      <div className="">
        <DataTable<Modelo>
          titulo="Modelos Registrados"
          columns={columns}
          data={modelos}
          onEdit={(row) => {
            setModeloEditando(row);
            setFormKey(prev => prev + 1); // fuerza recarga del form
          }}
          onDelete={(row) => eliminarModelo(row.id_modelo)}

        />
      </div>
    </div>
  );
}