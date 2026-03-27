import Form from "@/components/Form";
import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import { obtenerMarcas, handleSave, handleDelete } from "@/functions/ActionsMarcas";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import { useAlert } from "@/components/AlertContext";


type Marca = {
  id_marca: number,
  nombre_marca: string
};

export default function Catalogos() {

  const [tabActiva, setTabActiva] = useState("marcas");
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaEditando, setMarcaEditando] = useState<Marca | null>(null);
  const { showAlert } = useAlert();



  const tabs = [
    { id: "marcas", label: "Marcas" },
    { id: "modelos", label: "Modelos" },
    { id: "equipamiento", label: "Tipos de Equipamiento" },
  ];

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
          <span className="font-semibold text-sm text-foreground">
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

  const eliminarArea = async (id: number) => {
    const confirmed = await showAlert(
      "delete",
      "¿Deseas eliminar esta área?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await handleDelete(id);

    if (result.success) {
      // setAreas(prev => prev.filter(a => a.id_area !== id));

      await showAlert("success", result.message, "Eliminado");
    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  return (

    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">
      <Header
        titulo="Cátalogo de Equipamiento"
        subTitulo="Administración de marcas, modelo y tipos de dispositivos"
      />

      <div className="bg-white rounded-xl shadow-sm border p-4 dark:bg-oscuro-relleno dark:border-oscuro-redondear space-y-4 mb-4 h-max">
        <div className="flex gap-2 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`px-6 py-4 front-headline border-b-2 transition-all ${tabActiva === tab.id
                ? "text-primario border-primario font-bold"
                : "text-on-surface-variant/60 hover:text-on-surface"
                }`}
            >
              {tab.label}
            </button>
          ))}

        </div>
        <div className="mt-7">
          {tabActiva === "marcas" &&
            <div className="grid ggrid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-2">
                <Form
                  title={"Agregar Marca"}
                  fields={camposFormulario}
                  columns={1}
                  // defaultValues={}
                  onSubmit={async (values) => {

                    let result;

                    result = await executeAction(handleSave(values));

                    // if (areaEditando) {
                    //   result = await executeAction(
                    //     updateArea(areaEditando.id_area, values)
                    //   );
                    // } else {
                    //   result = await executeAction(handleSave(values));
                    // }

                    // if (result.success) {
                    //   close();
                    //   setAreaEditando(null);
                    // }

                  }}
                />

              </div>
              <div className="">
                <DataTable<Marca>
                  titulo="Marcas Registradas"
                  columns={columns}
                  data={marcas}
                  onEdit={(row) => console.log("Editar", row)}
                  // onEdit={(row) => {
                  //   setAreaEditando(row);
                  // }}
                  onDelete={(row) => eliminarArea(row.id_marca)}

                />
              </div>
            </div>
          }
          {tabActiva === "modelos" && <div>2</div>}
          {tabActiva === "equipamiento" && <div>3</div>}
        </div>
      </div>
    </div>
  );
}