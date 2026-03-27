import { useEffect, useState, useMemo } from "react";
import Form from "@/components/Form";
import Header from "@/components/Header";
import { useAlert } from "@/components/AlertContext";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import { handleSave, obtenerAreas, obtenerPadres, handleDelete, updateArea } from "@/functions/ActionsAreas";

// import {hadleSave} from "@functions/ActionsAreas"

type Area = {
  id_area: number;
  nombre_area: string;
  nomenclatura: string;
  siglas: string;
  telefono: string;
  extension: string;
  tipo_area: string;
  parent_id: number | null;
};

export default function Areas() {

  const { showAlert } = useAlert();
  const [areas, setAreas] = useState<Area[]>([]);
  const [jerarquia, setJerarquia] = useState<Area[]>([]);
  const [areaEditando, setAreaEditando] = useState<Area | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const cargarAreas = async () => {
    const res = await obtenerAreas();
    if (res.success) {
      setAreas(res.data);
    }
  };

  useEffect(() => {
    cargarAreas();

    obtenerPadres()
      .then((data) => setJerarquia(data))
      .catch(console.error)
  }, []);

  //cierra el modal 
  useEffect(() => {
    if (!openModal) {
      setAreaEditando(null);
    }
  }, [openModal]);


  const camposFormulario = useMemo(() => [
    { name: "nombre_area", label: "Nombre del Área ", placeholder: "Ej: Dirección General", type: "text", required: true },
    { name: "siglas", label: "Siglas (Iniciales) ", placeholder: "Ej: DRH", type: "text", required: true },
    { name: "telefono", label: "Teléfono", placeholder: "Ej: 7222360590", type: "text", required: true },
    { name: "extension", label: "Extensión", placeholder: "Ej: 2222", type: "number", required: true },
    { name: "nomenclatura", label: "Nomenclatura", placeholder: "Ej: 228C1502000", type: "text", required: true },
    {
      name: "tipo_area",
      label: "Tipo de Área",
      type: "select",
      required: true,
      options: [
        { label: "COORDINACIÓN", value: "COORDINACIÓN" },
        { label: "DEPARTAMENTO", value: "DEPARTAMENTO" },
        { label: "DIRECCIÓN", value: "DIRECCIÓN" },
        { label: "SECRETARÍA", value: "SECRETARÍA" },
        { label: "SUBDIRECCIÓN", value: "SUBDIRECCIÓN" },
        { label: "UNIDAD", value: "UNIDAD" },
      ],
    },
    {
      name: "parent_id",
      label: "Área Superior (Jerarquía)",
      type: "select",
      required: true,
      options: [
        { label: "NO TIENE JERARQUÍA", value: "sin_jerarquia" },
        ...jerarquia.map((area) => ({
          label: area.nombre_area,
          value: area.id_area, // 👈 usa el campo correcto
        })),
      ],
    },
  ], [jerarquia]);

  const columns: Column<Area>[] = [
    {
      key: "nombre_area",
      label: "Área",
      searchableValue: (p) =>
        `${p.nombre_area} ${p.nomenclatura} ${p.siglas} ${p.extension}`,
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">
            {p.nombre_area}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{p.siglas}</span>
            <span>•</span>
            <span>{p.nomenclatura}</span>
            {p.extension && (
              <>
                <span>•</span>
                <span>Ext. {p.extension}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "tipo_area",
      label: "Tipo",
      render: (p) => {
        const colors: Record<string, string> = {
          DIRECCIÓN:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          COORDINACIÓN:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
          SUBDIRECCIÓN:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
          DEPARTAMENTO:
            "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
          SECRETARÍA:
            "bg-olive-claro text-olive dark:bg-olive dark:text-olive-claro",
          UNIDAD:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100",
        };
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${colors[p.tipo_area] ??
              "bg-muted text-muted-foreground"
              }`}
          >
            {p.tipo_area}
          </span>
        );
      },
    },
    {
      key: "telefono",
      label: "Contacto",
      render: (p) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium">{p.telefono}</span>
          {p.extension && (
            <span className="text-xs text-muted-foreground">
              Ext. {p.extension}
            </span>
          )}
        </div>
      ),
    },
  ];

  //insert
  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {

      await showAlert("success", result.message, "Éxito");
      await cargarAreas();

      const padres = await obtenerPadres();
      setJerarquia(padres);

    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  //delete
  const eliminarArea = async (id: number) => {
    const confirmed = await showAlert(
      "delete",
      "¿Deseas eliminar esta área?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await handleDelete(id);

    if (result.success) {
      setAreas(prev => prev.filter(a => a.id_area !== id));

      await showAlert("success", result.message, "Eliminado");
    } else {
      await showAlert("error", result.message, "Error");
    }
  };


  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
        <div>
          <Header
            titulo="Administración de Áreas"
            subTitulo="Creación, Edición de las áreas que componen el instituto IMIFE"
            botonTexto="Agregar Nueva Área"
            open={openModal}
            setOpen={setOpenModal}
            modalContent={(close) => (
              <Form
                title={areaEditando ? "Editar Área" : "Agregar Área"}
                fields={camposFormulario}
                columns={2}
                defaultValues={
                  areaEditando
                    ? {
                      ...areaEditando,
                      parent_id: areaEditando.parent_id ?? "sin_jerarquia",
                    }
                    : {}
                }
                onSubmit={async (values) => {

                  let result;

                  if (areaEditando) {
                    result = await executeAction(
                      updateArea(areaEditando.id_area, values)
                    );
                  } else {
                    result = await executeAction(handleSave(values));
                  }

                  if (result.success) {
                    close();
                    setAreaEditando(null);
                  }

                }}
              />
            )}
          />
          <DataTable<Area>
            titulo="Coordinaciones Registradas"
            columns={columns}
            data={areas}
            // onEdit={(row) => console.log("Editar", row)}
            onEdit={(row) => {
              setAreaEditando(row);
              setOpenModal(true);
            }}
            onDelete={(row) => eliminarArea(row.id_area)}
          />

        </div>
      </div>
    </div>

  );
}