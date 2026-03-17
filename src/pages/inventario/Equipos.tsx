
import type { Column } from "@/components/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Form from "@/components/Form";
import Header from "@/components/Header";
import DataTable from "@/components/DataTable";
import { personalData } from "@/data/personal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Equipos() {

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
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">
      <Header
        titulo="Inventario de Equipos"
        subTitulo="Gestión centralizada de activos y dispositivos institucionales."
        botonTexto="Agregar Nuevo Equipo"
        modalTitle="Crear Equipo"
        modalContent={
          <Form
            fields={formFields}
            onSubmit={(data) => console.log(data)}
          />
        }
      />
      <div className="mb-5">
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#85666e]">
                <span className="material-symbols-outlined">search</span>
              </span>
              <Input
                placeholder="Buscar Dispositivo..."
                className="pl-12 text-lg bg-[#f4f1f1]"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex gap-2 text-primario-dark">
                <span className="material-symbols-outlined">filter_list</span>
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={personalData}
        onView={(row) => console.log("Ver", row)}
        onEdit={(row) => console.log("Editar", row)}
        onDelete={(row) => console.log("Eliminar", row)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {/* card 1 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined text-3xl">
                  check_circle
                </span>
              </div>
            </div>
            <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
              Total Activos
            </h4>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-950 dark:text-white">
                102
              </span>
            </div>
          </CardContent>
        </Card>

        {/* card 2 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined text-3xl">
                  mop
                </span>
              </div>
            </div>
            <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
              En Mantenimiento
            </h4>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-950 dark:text-white">
                24
              </span>
            </div>
          </CardContent>
        </Card>
        {/* card 3 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-primario/15 flex items-center justify-center text-primario">
                <span className="material-symbols-outlined text-3xl">
                  devices
                </span>
              </div>
            </div>
            <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
              Total Inventariado
            </h4>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-950 dark:text-white">
                224
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}