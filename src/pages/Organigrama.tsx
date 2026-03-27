
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Form from "@/components/Form";
import { useAlert } from "@/components/AlertContext";
import { obtenerEmpleados } from "@/functions/ActionsEmpleados";
import { obtenerAreas } from "@/functions/ActionsAreas";
import { handleSave, obtenerNombramientos, updateNombramiento, darBajaNombramiento, obtenerHistorialNombramientos } from "@/functions/ActionsNombramiento";
import OrganigramaTree from "@/components/organigrama/OrganigramaArbol";

type Empleado = {
  id_empleado: number;
  nombre: string;
  apellidos: string;
  estatus: String;
};

type Area = {
  id_area: number;
  nombre_area: string;
};

type Nombramiento = {
  id_nombramiento: number;
  sid_empleado: number;
  sid_area: number;
  activo: boolean;
  documento_nombramiento?: string;
};

export default function Organigrama() {

  const { showAlert } = useAlert();
  const [openModal, setOpenModal] = useState(false);
  const [organigramaEditando, setNombramientoEditando] = useState<Nombramiento | null>(null);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [nombramientos, setNombramientos] = useState<Nombramiento[]>([]);
  const [refreshTree, setRefreshTree] = useState(0);

  // console.log(empleados);

  const empleadosDisponibles = useMemo(() => {
    return empleados.filter((emp) => {
      if (emp.estatus !== "activo") return false;

      const tieneNombramientoActivo = nombramientos.some(
        (nom) =>
          nom.sid_empleado === emp.id_empleado &&
          nom.activo
      );

      return !tieneNombramientoActivo;
    });
  }, [empleados, nombramientos]);

  const areasDisponibles = useMemo(() => {
    return areas.filter((area) =>
      !nombramientos.some(
        (nom) => nom.sid_area === area.id_area && nom.activo
      )
    );
  }, [areas, nombramientos]);

  const handleEditarNombramiento = (data: any) => {
    setNombramientoEditando(data);
    setOpenModal(true);
  };

  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {
      await showAlert("success", result.message, "Éxito");


      setRefreshTree(prev => prev + 1); // ⭐ fuerza recarga árbol

      close();
      setNombramientoEditando(null);

      // await cargarEmpleados();

      // 🔹 actualizar el seleccionado


      // if (empleadoSeleccionado) {
      //   setEmpleadoSeleccionado(result.data);
      // }


    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  const cargarTodo = async () => {
    const [resEmp, resAreas, resNom] = await Promise.all([
      obtenerEmpleados(),
      obtenerAreas(),
      obtenerNombramientos(),
    ]);

    if (resEmp) setEmpleados(resEmp.data);
    if (resAreas) setAreas(resAreas.data);
    if (resNom) setNombramientos(resNom.data);
  };

  useEffect(() => {
    cargarTodo();

  }, []);

  useEffect(() => {
    if (!openModal) {
      setNombramientoEditando(null);
    }
  }, [openModal]);

  // console.log(nombramientos);

  const camposFormulario = useMemo(() => {
    const campos = [
      {
        name: "sid_empleado",
        label: "Servidor Público",
        type: "autocomplete",
        required: true,
        options: empleadosDisponibles.map((e) => ({
          value: e.id_empleado,
          label: `${e.nombre} ${e.apellidos}`,
        })),
      },
      {
        name: "sid_area",
        label: "Área Encargo",
        type: "autocomplete",
        required: true,
        options: areasDisponibles.map((a) => ({
          value: a.id_area,
          label: a.nombre_area,
        })),
      },
      {
        name: "cargo",
        label: "Título Cargo",
        placeholder: "Titular de área...",
        type: "text",
        required: true,
      },
      {
        name: "fecha_inicio",
        label: "Fecha Inicio",
        type: "date",
        required: true,
      },
      {
        name: "documento_nombramiento",
        label: "Documento Nombramiento",
        type: "file",
        required: !organigramaEditando,
        showPreview: true,
        allowDeleteFile: true,
      }
    ];

    // 🔥 Si está editando → quitar campos
    if (organigramaEditando) {
      return campos.filter(
        (c) => c.name !== "sid_empleado" && c.name !== "sid_area"
      );
    }

    return campos;
  }, [empleadosDisponibles, areasDisponibles, organigramaEditando]);

  const handleBajaNombramiento = async (
    id: number,
    fechaFin: string
  ) => {

    /* VALIDAR FECHA */
    if (!fechaFin) {
      await showAlert(
        "info",
        "Debes seleccionar la fecha de baja.",
        "Campo obligatorio"
      );
      return;
    }

    const confirmed = await showAlert(
      "delete",
      "¿Deseas dar de baja este nombramiento?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await darBajaNombramiento(id, fechaFin);

    if (result.success) {
      await showAlert("success", result.message, "Actualizado");

      setRefreshTree(prev => prev + 1); // recargar árbol
      cargarTodo();
      return result;                     // recargar combos / datos
    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  const handleViewHistory = async (areaId: number) => {

    const res = await obtenerHistorialNombramientos(areaId);

    return res;   // 🔥 IMPORTANTE
  };

  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
        <Header
          titulo="Organigrama Institucional"
          subTitulo="Visualización y gestión de la estructura departamental del organismo"
          botonTexto="Agregar Nombramiento"
          open={openModal}
          setOpen={setOpenModal}
          modalContent={(close) => (
            <Form
              title={organigramaEditando ? "Editar Nombramiento" : "Agregar Nombramiento"}
              fields={camposFormulario}
              columns={2}
              defaultValues={
                organigramaEditando
                  ? {
                    ...organigramaEditando,
                    documento_nombramiento_url:
                      `${import.meta.env.VITE_API_URL}/uploads/nombramientos/${organigramaEditando.documento_nombramiento}`,
                  }
                  : undefined
              }
              onSubmit={async (formData) => {

                let result;

                if (organigramaEditando) {
                  result = await executeAction(
                    updateNombramiento(
                      organigramaEditando.id_nombramiento,
                      formData
                    )
                  );
                } else {
                  result = await executeAction(
                    handleSave(formData)
                  );
                }

                if (result.success) {
                  close();
                  setNombramientoEditando(null);
                  cargarTodo();
                }

              }}
            />
          )}
        />
      </div>
      <div>
        <OrganigramaTree
          refresh={refreshTree}
          onEditar={handleEditarNombramiento}
          onDelete={handleBajaNombramiento}
          viewHistory={handleViewHistory}
        />
      </div>


    </div>
  );
}
