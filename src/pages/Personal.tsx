
import { personalData } from "@/data/personal";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PersonalCard from "@/components/PersonalCard";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import { Button } from "@/components/ui/button";

export default function Personal() {

  type Personal = {
    id: number;
    nombre: string;
    rol: string;
    area: string;
    estado: string;
    avatar?: string;
  };

  const columns: Column<Personal>[] = [
    {
      key: "usuario",
      label: "Usuario",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={p.avatar} />
            <AvatarFallback>
              {p.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{p.nombre}</p>
            <p className="text-xs text-muted-foreground">{p.rol}</p>
          </div>
        </div>
      ),
    },
    {
      key: "area",
      label: "Área",
    },
    {
      key: "estado",
      label: "Estado",
      render: (p) => (
        <span
          className={`px-2 py-1 text-xs rounded-full
        ${p.estado === "Activo"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"}`}
        >
          {p.estado}
        </span>
      ),
    },
  ];

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "apellido", label: "Apellido", type: "text", required: true },
    { name: "clave", label: "Número Servidor", type: "text" },

    {
      name: "sexo",
      label: "Sexo",
      type: "select",
      options: ["MASCULINO", "FEMENINO"],
    },

    {
      name: "nivel",
      label: "Nivel",
      type: "select",
      options: ["Primaria", "Secundaria", "Preparatoria"],
    },

    {
      name: "foto",
      label: "Foto",
      type: "file",
      colSpan: 3, // 👈 ocupa toda la fila en desktop
    },
  ];


  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border p-4">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Servidores Públicos Registrados</h2>

            <Modal
              title=""
              trigger={
                <Button className="bg-primario text-white hover:bg-primario-dark">
                  + Nuevo
                </Button>
              }
            >
              <Form
                title="Agregar Personal"
                fields={formFields}
                columns={3}
                onSubmit={(data) => console.log(data)}
              />
            </Modal>

          </div>

          <DataTable
            columns={columns}
            data={personalData}
            onView={(row) => console.log("Ver", row)}
            onEdit={(row) => console.log("Editar", row)}
            onDelete={(row) => console.log("Eliminar", row)}
          />


        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <PersonalCard />
          <PersonalCard />
          <PersonalCard />
        </div>
      </div >
    </>
  );
}