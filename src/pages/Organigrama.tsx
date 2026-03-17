
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Form from "@/components/Form";
import { useAlert } from "@/components/AlertContext";


type Organigrama = {

}

export default function Organigrama() {

  const { showAlert } = useAlert();
  const [openModal, setOpenModal] = useState(false);
  const [organigramaEditando, setOrganigramaEditando] = useState<Organigrama | null>(null);

  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {
      await showAlert("success", result.message, "Éxito");
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

  const camposFormulario = useMemo(() => [
    { name: "sid_empleado", label: "Servidor Público", placeholder: "Nombre", type: "text", required: true },
    { name: "sid_area", label: "Área Encargo", placeholder: "Área", type: "text", required: true },

    // {
    //   name: "sid_area",
    //   label: "Área",
    //   type: "select",
    //   required: true,
    //   options: areas.map((a) => ({
    //     label: a.nombre_area,
    //     value: a.id_area
    //   })),
    // },
    { name: "nombre_cargo", label: "Titulo Cargo", placeholder: "Titular área ...", type: "text", required: true },
    { name: "fecha_inicio", label: "Fecha Inicio", placeholder: "ISSEMYM", type: "number", required: true },
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
  ], []);


  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">
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
                  // estatus: organigramaEditando.estatus === "activo",
                }
                : undefined
            }
            onSubmit={async (values) => {

              let result;

              if (organigramaEditando) {
                // result = await executeAction(
                //   updateEmpleados(organigramaEditando.id_empleado, values)
                // );
              } else {
                // result = await executeAction(handleSave(values));
              }

              // if (result.success) {
              //   close();
              //   setOrganigramaEditando(null);
              // }

            }}
          />
        )}
      />

    </div>
  );
}
