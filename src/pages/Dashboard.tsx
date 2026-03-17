import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">

      {/* Heading */}
      <Header
        titulo="Bienvenido"
        subTitulo="Resumen general de actividades y tareas prioritarias para la jornada de hoy."
      />
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {/* KPI 1 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-primario/15 flex items-center justify-center text-primario">
                <span className="material-symbols-outlined text-3xl">
                  pending_actions
                </span>
              </div>
              <Badge className="bg-primario/10 text-primario font-bold uppercase">
                Urgente
              </Badge>
            </div>

            <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
              Oficios Pendientes
            </h4>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-950 dark:text-white">
                24
              </span>
              <span className="text-sm text-red-600 font-medium">
                +5 hoy
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-3xl">
                  support_agent
                </span>
              </div>
              <Badge variant="secondary" className="text-blue-600">
                Activos
              </Badge>
            </div>

            <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
              Tickets Abiertos
            </h4>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-950 dark:text-white">
                12
              </span>
              <span className="text-sm text-stone-700 font-medium">
                En proceso
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-3xl">
                  devices
                </span>
              </div>
              <Badge className="bg-green-50 text-green-600">
                Registrados
              </Badge>
            </div>

            <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
              Equipos Asignados
            </h4>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-950 dark:text-white">
                158
              </span>
              <span className="text-sm text-stone-700 font-medium">
                Verificados
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ACCESOS RÁPIDOS */}
      <section>
        <div className="flex items-center justify-between mb-6 pb-4">
          <h4 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primario">
              bolt
            </span>
            Accesos Rápidos
          </h4>
          <Button variant="link" className="text-primario font-bold">
            Gestionar Atajos
          </Button>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "add_circle", label: "Nuevo Oficio" },
            { icon: "upload_file", label: "Cargar SIC" },
            { icon: "inventory", label: "Registrar Equipo" },
            { icon: "analytics", label: "Generar Reporte" },
          ].map((item) => (
            <button
              key={item.label}
              className="
                flex flex-col items-center justify-center
                p-8 bg-white dark:bg-[#2A1D21] dark:border-[#765B63]
                border-2 border-transparent
                hover:border-primario
                rounded-xl transition-all group shadow-sm
              "
            >
              <div className="size-16 rounded-full bg-primario/10 text-primario flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">
                  {item.icon}
                </span>
              </div>
              <span className="font-bold text-base text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ACTIVIDAD RECIENTE + EVENTO */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Actividad */}
        <Card>
          <CardHeader className="font-bold text-lg">
            Actividad Reciente
          </CardHeader>

          <CardContent className="divide-y">
            {[
              {
                icon: "history_edu",
                color: "text-blue-500",
                title: "Oficio No. 452 firmado por Rectoría",
                time: "Hace 15 minutos",
              },
              {
                icon: "check_circle",
                color: "text-green-500",
                title: "Ticket #1209 marcado como Resuelto",
                time: "Hace 2 horas",
              },
              {
                icon: "warning",
                color: "text-amber-500",
                title: "Aviso de mantenimiento de red programado",
                time: "Hace 4 horas",
              },
            ].map((item, i) => (
              <div key={i} className="p-4 flex gap-4 items-start">
                <span className={`material-symbols-outlined ${item.color}`}>
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-stone-700 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evento */}
        <div className="bg-primario/5 rounded-xl border-2 border-dashed border-primario/20 flex flex-col items-center justify-center p-8 text-center">
          <span className="material-symbols-outlined icon-xl text-primario/40 mb-4">
            calendar_month
          </span>
          <h5 className="text-xl font-bold text-primario">
            Próximo Evento
          </h5>
          <p className="text-stone-700 max-w-xs mt-2">
            Reunión Trimestral de Inventario el 25 de Octubre a las 10:00 AM
          </p>
          <Button className="mt-6 bg-primario hover:bg-primario-dark">
            Ver Calendario
          </Button>
        </div>

      </div>
    </div>
  );
}
