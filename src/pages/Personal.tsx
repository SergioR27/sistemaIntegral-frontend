import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Form from "@/components/Form";
import { obtenerEmpleados, handleSave, updateEmpleados, handleDelete } from "@/functions/ActionsEmpleados";
import { obtenerAreas } from "@/functions/ActionsAreas";
import DataTable from "@/components/DataTable";
import { Avatar, AvatarTable } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAlert } from "@/components/AlertContext";
import PersonalCard from "@/components/PersonalCard";
import { exportEmpleadosExcel } from "@/excel/exportEmpleadosExcel";
import { descargarTodo } from "@/components/DescargarTodo";


type Empleado = {
  id_empleado: number,
  sid_area: number,
  nombre: string,
  apellidos: string,
  nip_issemyn: string,
  categoria: string,
  curp: string,
  correo: string,
  municipio: string,
  sexo: string,
  estatus: string,
  area?: {
    id_area: number
    nombre_area: string
  }
};

type Area = {
  id_area: number;
  nombre_area: string;
};

export default function Personal() {

  const { showAlert } = useAlert();
  const [openModal, setOpenModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(null);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const activos = empleados.filter(e => e.estatus === "activo");

  const cargarEmpleados = async () => {
    const res = await obtenerEmpleados();
    if (res.success) {
      setEmpleados(res.data);
    }
  };

  const cargarAreas = async () => {
    const res = await obtenerAreas();
    if (res.success) {
      setAreas(res.data);
    }
  };

  useEffect(() => {
    cargarEmpleados();

    cargarAreas();
  }, []);

  //cierra el modal
  useEffect(() => {
    if (!openModal) {
      setEmpleadoEditando(null);
    }
  }, [openModal]);

  const camposFormulario = useMemo(() => [
    { name: "nombre", label: "Nombre", placeholder: "Nombre", type: "text", required: true },
    { name: "apellidos", label: "Apellidos", placeholder: "Apelidos", type: "text", required: true },

    {
      name: "sid_area",
      label: "Área",
      type: "select",
      required: true,
      options: areas.map((a) => ({
        label: a.nombre_area,
        value: a.id_area
      })),
    },
    { name: "curp", label: "CURP", placeholder: "CURP", type: "text", required: true },
    { name: "nip_issemyn", label: "Clave ISSEMYM", placeholder: "ISSEMYM", type: "number", required: true },
    { name: "categoria", label: "Categoría", placeholder: "Categoría", type: "text", required: true },

    {
      name: "municipio",
      label: "Municipio",
      type: "select",
      required: true,
      options: [
        { label: "TOLUCA", value: "TOLUCA" },
        { label: "TLALMANALCO", value: "TLALMANALCO" },
        { label: "ECATEPEC", value: "ECATEPEC" },
      ],
    },

    {
      name: "sexo",
      label: "Sexo",
      type: "select",
      required: true,
      options: [
        { label: "HOMBRE", value: "H" },
        { label: "MUJER", value: "M" },
      ],
    },

    {
      name: "estatus",
      label: "Estatus",
      type: "select",
      required: true,
      options: [
        { label: "ACTIVO", value: "activo" },
        { label: "BAJA", value: "baja" },
        { label: "LICENCIA", value: "licencia" },
        { label: "INCAPACIDAD", value: "incapacidad" },
      ],
    },
  ], [areas]);




  const columns = [
    {
      key: "nombre",
      label: "Empleado",
      searchableValue: (p: Empleado) =>
        `${p.nombre} ${p.apellidos}`,
      render: (p: Empleado) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarTable>
              {p.nombre?.charAt(0)}
              {p.apellidos?.charAt(0)}
            </AvatarTable>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">
              {p.nombre} {p.apellidos}
            </span>

            <span className="text-xs text-muted-foreground">
              {p.categoria}
            </span>
          </div>
        </div>
      ),
    },

    {
      key: "area",
      label: "Área",
      searchableValue: (p: Empleado) =>
        p.area?.nombre_area || "",
      render: (p: Empleado) => (
        <Badge
          variant="secondary"
          className="whitespace-normal line-clamp-2 text-left"
        >
          {p.area?.nombre_area}
        </Badge>
      ),
    },

    {
      key: "municipio",
      label: "Municipio",
      searchableValue: (p: Empleado) => p.municipio,
      render: (p: Empleado) => (
        <span className="text-sm">{p.municipio}</span>
      ),
    },

    {
      key: "curp",
      label: "CURP",
      searchableValue: (p: Empleado) => p.curp,
      render: (p: Empleado) => (
        <span className="text-sm text-muted-foreground">
          {p.curp}
        </span>
      ),
    },

    {
      key: "estatus",
      label: "Estatus",
      searchableValue: (p: Empleado) => p.estatus,
      render: (p: Empleado) => (
        <Badge
          variant={
            p.estatus === "activo"
              ? "success"
              : p.estatus === "licencia"
                ? "other"
                : "destructive"
          }
        >
          {p.estatus}
        </Badge>
      ),
    },
  ];


  //delete
  // const eliminarPersonal = async (id: number) => {
  //   const confirmed = await showAlert(
  //     "delete",
  //     "¿Deseas eliminar este empleado?",
  //     "Confirmar eliminación"
  //   );

  //   if (!confirmed) return;

  //   const result = await handleDelete(id);

  //   if (result.success) {
  //     setEmpleados(prev => prev.filter(a => a.id_empleado !== id));

  //     await showAlert("success", result.message, "Eliminado");
  //   } else {
  //     await showAlert("error", result.message, "Error");
  //   }
  // };

  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {
      await showAlert("success", result.message, "Éxito");
      await cargarEmpleados();

      // 🔹 actualizar el seleccionado


      if (empleadoSeleccionado) {
        setEmpleadoSeleccionado(result.data);
      }


    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  // console.log(activos);

  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
        <Header
          titulo="Administración de Servidores Públicos"
          subTitulo="Creación, Edición de Servidores Públicos del IMIFE"
          botonTexto="Agregar Nuevo Servidor Público"
          open={openModal}
          setOpen={setOpenModal}
          modalContent={(close) => (
            <Form
              title={empleadoEditando ? "Editar Servidor Público" : "Agregar Servidor Público"}
              fields={camposFormulario}
              columns={2}
              defaultValues={
                empleadoEditando
                  ? {
                    ...empleadoEditando,
                    // estatus: empleadoEditando.estatus === "activo",
                  }
                  : undefined
              }
              onSubmit={async (values) => {

                let result;

                if (empleadoEditando) {
                  result = await executeAction(
                    updateEmpleados(empleadoEditando.id_empleado, values)
                  );
                } else {
                  result = await executeAction(handleSave(values));
                }

                if (result.success) {
                  close();
                  setEmpleadoEditando(null);
                }

              }}


            />
          )}
        />
        {/* <DataTable<Empleado>
          titulo="Empleados Registrados"
          columns={columns}
          data={empleados}
          onView={(row) => console.log("ver", row)}
          onEdit={(row) => {
            setEmpleadoEditando(row);
            setOpenModal(true);
          }}
          onDelete={(row) => eliminarPersonal(row.id_empleado)}
        /> */}

        <div className="flex flex-col md:flex-row gap-6">

          {/* TABLA */}
          <div
            className={`
            transition-all duration-300
            ${empleadoSeleccionado ? "hidden md:block md:w-3/4" : "w-full"}
          `}
          >
            <DataTable<Empleado>
              titulo="Empleados Registrados"
              columns={columns}
              data={empleados}
              onView={(row) => setEmpleadoSeleccionado(row)}
              onEdit={(row) => {
                setEmpleadoEditando(row);
                setOpenModal(true);
              }}
              // onDelete={(row) => eliminarPersonal(row.id_empleado)}
              showExcel
              showQR
              onExcel={(data, titulo) => exportEmpleadosExcel(data, titulo)}
              onQr={() => descargarTodo(activos)}
            />
          </div>

          {/* CARD */}
          {empleadoSeleccionado && (
            <div className="w-full md:w-1/4 flex justify-center">
              <PersonalCard
                empleado={empleadoSeleccionado}
                onClose={() => setEmpleadoSeleccionado(null)}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}