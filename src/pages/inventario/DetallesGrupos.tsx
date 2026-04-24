import { useState, useEffect } from "react";
import { obtenerDetalleGrupo } from "@/functions/ActionsDispositivos";
import { Card, CardContent } from "@/components/ui/card";
import QrEquipamiento from "./QrEquipamiento";
import {
  X,
  Monitor,
  Cpu,
  Keyboard,
  Mouse,
  Laptop,
  PcCase,
  Printer,
  Cable,
  BatteryCharging,
  LaptopMinimal,
  Hash,
  ScanLine,
  Network,
  HardDrive,
  MemoryStick,
  CalendarDays,
  UserRound,
  Building2,
  StickyNote,
} from "lucide-react";


type Props = {
  idGrupo: number;
  onBack: () => void;
};

export default function DetallesGrupo({ idGrupo, onBack }: Props) {

  const [grupo, setGrupo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);

      const res = await obtenerDetalleGrupo(idGrupo);

      if (res.success) {
        setGrupo(res.data);
      }

      setLoading(false);
    };

    if (idGrupo) {
      cargarDetalle();
    }
  }, [idGrupo]);


  if (loading) {
    return <div>Cargando detalle...</div>;
  }

  // if (!grupo) {
  //   return (
  //     <div>
  //       <button onClick={onBack}>Regresar</button>
  //       <p>No se encontró información del grupo.</p>
  //     </div>
  //   );
  // }

  const getIconByTipo = (tipo?: string) => {
    switch (tipo?.toUpperCase()) {
      case "DESKTOP":
        return <PcCase className="w-5 h-5 text-blue-600" />;
      case "MONITOR":
        return <Monitor className="w-5 h-5 text-violet-600" />;
      case "TECLADO":
        return <Keyboard className="w-5 h-5 text-amber-600" />;
      case "MOUSE":
        return <Mouse className="w-5 h-5 text-pink-600" />;
      case "LAPTOP":
        return <Laptop className="w-5 h-5 text-sky-600" />;
      case "IMPRESORA":
        return <Printer className="w-5 h-5 text-slate-600" />;
      case "CARGADOR":
        return <Cable className="w-5 h-5 text-rose-600" />;
      case "NO BREAK":
        return <BatteryCharging className="w-5 h-5 text-green-600" />;
      case "MAC":
        return <LaptopMinimal className="w-5 h-5 text-yellow-600" />;
      default:
        return <Cpu className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusStyle = (estatus?: string) => {
    switch (estatus) {
      case "DISPONIBLE":
        return "bg-green-100 text-green-700";
      case "ASIGNADO":
        return "bg-blue-100 text-blue-700";
      case "BAJA":
        return "bg-red-100 text-red-700";
      case "MANTENIMIENTO":
        return "bg-yellow-100 text-yellow-700";
      case "ACTIVO":
        return "bg-emerald-100 text-emerald-700";
      case "INACTIVO":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "No registrado";
    return value;
  };

  const formatDate = (value?: string) => {
    if (!value) return "No disponible";
    return new Date(value).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primario via-primario to-oscuro-fondo text-white p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    Grupo de Equipamiento
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    CTRL-IMIFE-{String(grupo.numero_control).padStart(3, "0")}
                  </h2>
                  <p className="text-sm text-slate-300 mt-2">
                    Token: {grupo.token}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(grupo.estatus)}`}>
                    {grupo.estatus}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                    {grupo.detalles?.length || 0} dispositivos
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                    Alta: {formatDate(grupo.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <QrEquipamiento codigo={String(grupo.numero_control)} size={120} />

                <button
                  onClick={onBack}
                  className="p-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900">
            <Card className="shadow-none border bg-slate-50 dark:bg-slate-800/70">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Hash className="w-4 h-4 text-slate-500" />
                  <p className="text-xs uppercase text-slate-500">Número de Control</p>
                </div>
                <p className="text-xl font-bold text-slate-800 dark:text-white">
                  {grupo.numero_control}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none border bg-slate-50 dark:bg-slate-800/70">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <ScanLine className="w-4 h-4 text-slate-500" />
                  <p className="text-xs uppercase text-slate-500">Token</p>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white break-all">
                  {grupo.token}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none border bg-slate-50 dark:bg-slate-800/70">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                  <p className="text-xs uppercase text-slate-500">Fecha de Registro</p>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {formatDate(grupo.created_at)}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Inventario del Grupo
            </h3>
            <p className="text-sm text-slate-500">
              Detalle técnico y administrativo de cada dispositivo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {grupo.detalles?.map((item: any) => {
            const d = item.dispositivos;

            return (
              <Card
                key={item.id}
                className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900"
              >
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {getIconByTipo(d.tipo?.nombre_tipo)}
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {formatValue(d.tipo?.nombre_tipo)}
                        </p>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatValue(d.modelo?.nombre_modelo)}
                        </h4>
                        <p className="text-sm text-slate-500">
                          Marca: {formatValue(d.modelo?.marca?.nombre_marca)}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(d.estatus)}`}>
                      {d.estatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/60 p-4">
                      <p className="text-xs uppercase text-slate-500 mb-1">Número de Serie</p>
                      <p className="font-semibold text-slate-800 dark:text-white break-all">
                        {formatValue(d.numero_serie)}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/60 p-4">
                      <p className="text-xs uppercase text-slate-500 mb-1">Número de Inventario</p>
                      <p className="font-semibold text-slate-800 dark:text-white break-all">
                        {formatValue(d.numero_inventario)}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/60 p-4">
                      <p className="text-xs uppercase text-slate-500 mb-1">Service Tag</p>
                      <p className="font-semibold text-slate-800 dark:text-white break-all">
                        {formatValue(d.service_tag)}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/60 p-4">
                      <p className="text-xs uppercase text-slate-500 mb-1">ID Dispositivo</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {formatValue(d.id_dispositivo)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                      Especificaciones técnicas
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 rounded-xl border p-3">
                        <Cpu className="w-4 h-4 mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Procesador</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {formatValue(d.procesador)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border p-3">
                        <MemoryStick className="w-4 h-4 mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">RAM</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {d.ram ? `${d.ram} GB` : "No registrado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border p-3">
                        <HardDrive className="w-4 h-4 mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Disco Duro</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {d.disco_duro ? `${d.disco_duro} GB` : "No registrado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border p-3">
                        <Network className="w-4 h-4 mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">MAC Ethernet</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white break-all">
                            {formatValue(d.mac_ethernet)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border p-3 md:col-span-2">
                        <Network className="w-4 h-4 mt-0.5 text-sky-600" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">MAC WiFi</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white break-all">
                            {formatValue(d.mac_wifi)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-400 flex justify-between">
                    <span>Creado: {formatDate(d.created_at)}</span>
                    <span>Actualizado: {formatDate(d.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <UserRound className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Asignación
              </h3>
            </div>

            {grupo.asignaciones?.length > 0 ? (
              <div className="space-y-4">
                {grupo.asignaciones.map((a: any) => (
                  <div
                    key={a.id_asignacion}
                    className="rounded-xl border bg-slate-50 dark:bg-slate-800/50 p-4"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {a.asignacionEmpleado?.nombre} {a.asignacionEmpleado?.apellidos}
                    </p>

                    <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Área: {formatValue(a.asignacionEmpleado?.area?.nombre_area)}
                      </p>
                      <p>Fecha de asignación: {formatDate(a.fecha_asignacion)}</p>
                      <p>Estatus: {formatValue(a.estatus)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Sin asignación registrada.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <StickyNote className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Observaciones
              </h3>
            </div>

            {grupo.observaciones?.length > 0 ? (
              <div className="space-y-4">
                {grupo.observaciones.map((obs: any) => (
                  <div
                    key={obs.id}
                    className="rounded-xl border-l-4 border-amber-500 bg-amber-50/60 dark:bg-slate-800/60 p-4"
                  >
                    <p className="text-sm text-slate-800 dark:text-slate-100">
                      {obs.comentario}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {formatDate(obs.created_at)} • {obs.tipo}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No hay observaciones registradas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

  );
}