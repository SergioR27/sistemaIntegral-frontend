import { useState, useEffect, useRef } from "react";
import { obtenerDetalleGrupo } from "@/functions/ActionsDispositivos";
import { Card, CardContent } from "@/components/ui/card";
import QrEquipamiento, { type QrEquipamientoHandle } from "./QrEquipamiento";
import { updateDispositivo, handleDelete, handleDeleteGroup, handleAssignGroup, handleUnassignGroup, handleComentario, actualizarGrupoDispositivo } from "@/functions/ActionsDispositivos";
import { obtenerEmpleados } from "@/functions/ActionsEmpleados";
import { obtenerDispositivos } from "@/functions/ActionsDispositivos";
import { useAlert } from "@/components/AlertContext";
import { descargarPdfGrupo } from "./DescargarPdfGrupo";

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
  Network,
  HardDrive,
  MemoryStick,
  UserRound,
  Building2,
  StickyNote,
  FileDown,
  QrCode,
  Trash2,
} from "lucide-react";


type Props = {
  idGrupo: number;
  onBack: () => void | Promise<void>;
};

export default function DetallesGrupo({ idGrupo, onBack }: Props) {

  const { showAlert } = useAlert();
  const [grupo, setGrupo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicion, setFormEdicion] = useState<any>({});
  const [servidoresPublicos, setServidoresPublicos] = useState<any[]>([]);
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false);
  const [sidEmpleadoSeleccionado, setSidEmpleadoSeleccionado] = useState("");
  const [cargandoServidores, setCargandoServidores] = useState(false);
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [agregarDispositivo, setAgregarDispositivo] = useState(false);
  const qrRef = useRef<QrEquipamientoHandle | null>(null);
  const [dispositivos, setDispositivos] = useState<any[]>([]);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState("");
  const [busquedaDispositivo, setBusquedaDispositivo] = useState("");



  const iniciarEdicion = (dispositivo: any) => {
    setEditandoId(dispositivo.id_dispositivo);
    setFormEdicion({
      numero_serie: dispositivo.numero_serie || "",
      numero_inventario: dispositivo.numero_inventario || "",
      service_tag: dispositivo.service_tag || "",
      procesador: dispositivo.procesador || "",
      ram: dispositivo.ram || "",
      disco_duro: dispositivo.disco_duro || "",
      mac_ethernet: dispositivo.mac_ethernet || "",
      mac_wifi: dispositivo.mac_wifi || "",
      estatus: dispositivo.estatus || "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEdicion({});
  };

  const handleChangeEdicion = (field: string, value: any) => {
    setFormEdicion((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cargarDetalle = async () => {
    setLoading(true);

    const res = await obtenerDetalleGrupo(idGrupo);

    if (res.success) {
      setGrupo(res.data);
    }

    setLoading(false);
  };

  useEffect(() => {

    if (idGrupo) {
      cargarDetalle();
    }
  }, [idGrupo]);

  const getTipoStyles = (tipo: string) => {
    switch (tipo) {
      case "NOTA":
        return {
          border: "border-blue-500",
          bg: "bg-blue-50/60 dark:bg-blue-900/20",
          text: "text-blue-800 dark:text-blue-200",
        };

      case "BAJA":
        return {
          border: "border-red-500",
          bg: "bg-red-50/60 dark:bg-red-900/20",
          text: "text-red-800 dark:text-red-200",
        };

      case "CAMBIO":
        return {
          border: "border-purple-500",
          bg: "bg-purple-50/60 dark:bg-purple-900/20",
          text: "text-purple-800 dark:text-purple-200",
        };

      case "MANTENIMIENTO":
        return {
          border: "border-amber-500",
          bg: "bg-amber-50/60 dark:bg-amber-900/20",
          text: "text-amber-800 dark:text-amber-200",
        };

      case "INCIDENCIA":
        return {
          border: "border-rose-500",
          bg: "bg-rose-50/60 dark:bg-rose-900/20",
          text: "text-rose-800 dark:text-rose-200",
        };

      default:
        return {
          border: "border-slate-400",
          bg: "bg-slate-50 dark:bg-slate-800",
          text: "text-slate-800 dark:text-slate-200",
        };
    }
  };


  const guardarEdicion = async (idDispositivo: number) => {

    // aquí llamas tu action

    const res = await updateDispositivo(idDispositivo, formEdicion);

    // si todo sale bien:
    if (res.success) {
      await showAlert("success", res.message, "Éxito");
      setEditandoId(null);
      setFormEdicion({});
      await cargarDetalle();
    } else {
      await showAlert("error", res.message, "Error");
    }
  };

  const cargarServidoresActivos = async () => {
    if (servidoresPublicos.length > 0) return;

    setCargandoServidores(true);

    const res = await obtenerEmpleados();

    if (res.success) {
      const activos = (res.data || []).filter(
        (empleado: any) => empleado.estatus === "activo"
      );

      setServidoresPublicos(activos);
    } else {
      await showAlert("error", res.message, "Error");
    }

    setCargandoServidores(false);
  };

  const togglePanelAsignacion = async () => {
    if (grupo?.asignaciones?.some((a: any) => a.estatus === "ACTIVO")) {
      return;
    }

    if (!mostrarAsignacion) {
      await cargarServidoresActivos();
    }

    setMostrarAsignacion((prev) => !prev);
  };

  const asignarGrupoSeleccionado = async () => {
    if (!sidEmpleadoSeleccionado) {
      await showAlert(
        "warning",
        "Debes seleccionar un servidor público para asignar este grupo.",
        "Asignación"
      );
      return;
    }

    const result = await handleAssignGroup(idGrupo, Number(sidEmpleadoSeleccionado));

    if (result.success) {
      setMostrarAsignacion(false);
      setSidEmpleadoSeleccionado("");
      await showAlert("success", result.message, "Asignado");
      await cargarDetalle();
    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  const quitarAsignacionGrupo = async () => {

    const confirmed = await showAlert(
      "delete",
      "¿Deseas quitar la asignación activa de este grupo?",
      "Confirmar eliminación"
    );

    if (!confirmed) return;

    const result = await handleUnassignGroup(idGrupo);

    if (result.success) {
      setMostrarAsignacion(false);
      setSidEmpleadoSeleccionado("");
      await showAlert("success", result.message, "Actualizado");
      await cargarDetalle();
    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  const agregarComentario = async () => {
    const comentario = comentarioTexto.trim();

    if (!comentario) {
      await showAlert(
        "warning",
        "Debes escribir una observación antes de guardarla.",
        "Comentario"
      );
      return;
    }

    const result = await handleComentario(comentario, idGrupo);

    if (result.success) {
      setComentarioTexto("");
      await showAlert("success", result.message, "Comentario");
      await cargarDetalle();
    } else {
      await showAlert("error", result.message, "Error");
    }
  };


  if (loading) {
    return <div>Cargando detalle...</div>;
  }

  if (!grupo) {
    return (
      <div>
        <button onClick={onBack}>Regresar</button>
        <p>No se encontró información del grupo.</p>
      </div>
    );
  }

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

  const solicitarRazonBaja = (
    mensajeOType: string,
    mensajeOpcional?: string,
    ..._args: unknown[]
  ) => {
    const mensaje = mensajeOpcional ?? mensajeOType;

    return showAlert(
      "delete",
      mensaje,
      "Confirmar baja",
      {
        requireInput: true,
        inputLabel: "Razón de la baja",
        inputPlaceholder: "Escribe la razón de la baja",
        confirmText: "Dar de baja",
      }
    );
  };

  const eliminarDispositivo = async (id: number) => {
    const resultAlert = await solicitarRazonBaja(
      "delete",
      "¿Deseas dar de baja este dispositivo? Captura la razón para registrarla en observaciones.",
      "Confirmar baja",
      {
        requireInput: true,
        inputLabel: "Razón de la baja",
        inputPlaceholder: "Escribe la razón de la baja",
        confirmText: "Dar de baja",
      }
    );

    if (!resultAlert.confirmed) return;

    const result = await handleDelete(id, resultAlert.value);

    if (result.success) {
      await showAlert("success", result.message, "Eliminado");
      await cargarDetalle();
    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  const eliminarGrupoCompleto = async () => {
    const resultAlert = await solicitarRazonBaja(
      "¿Deseas dar de baja todo este grupo? Esta acción marcará todos los dispositivos del grupo como BAJA y registrará la observación."
    );

    if (!resultAlert.confirmed) return;

    const result = await handleDeleteGroup(idGrupo, resultAlert.value);

    if (result.success) {
      await showAlert("success", result.message, "Eliminado");
      await cargarDetalle();
    } else {
      await showAlert("error", result.message, "Error");
    }
  };

  const codigoGrupo = `CTRL-IMIFE-${String(grupo.numero_control).padStart(3, "0")}`;
  const asignacionActiva = grupo.asignaciones?.find(
    (asignacion: any) => asignacion.estatus === "ACTIVO"
  );
  const estatusDispositivoDestino = asignacionActiva ? "ASIGNADO" : "DISPONIBLE";
  const handleAccionAsignacion = async () => {
    if (asignacionActiva) {
      await quitarAsignacionGrupo();
      return;
    }

    await togglePanelAsignacion();
  };

  const grupoInactivo =
    grupo.estatus === "INACTIVO" ||
    ((grupo.detalles?.length ?? 0) > 0 &&
      grupo.detalles.every(
        (item: any) => item.dispositivos?.estatus === "BAJA"
      ));

  const dispositovosEstatus =
    grupo.detalles?.some(
      (item: any) => item.dispositivos?.estatus === "ASIGNADO"
    ) ||

    // Si todos están en BAJA
    (
      (grupo.detalles?.length ?? 0) > 0 &&
      grupo.detalles.every(
        (item: any) => item.dispositivos?.estatus === "BAJA"
      )
    );

  const obtenerEtiquetaDispositivo = (item: any) => {
    if (!item) return "Dispositivo no encontrado";

    const inventario = item.numero_inventario || "Sin inventario";
    const modelo = item.modelo?.nombre_modelo || "Sin modelo";
    const marca = item.modelo?.marca?.nombre_marca;
    const serie = item.numero_serie ? ` · Serie: ${item.numero_serie}` : "";

    return `${inventario} - ${marca ? `${marca} ` : ""}${modelo}${serie}`;
  };

  const dispositivosFiltrados = dispositivos.filter((item: any) => {
    const termino = busquedaDispositivo.trim().toLowerCase();

    if (!termino) return true;

    return [
      obtenerEtiquetaDispositivo(item),
      item.numero_inventario,
      item.numero_serie,
      item.service_tag,
      item.modelo?.nombre_modelo,
      item.modelo?.marca?.nombre_marca,
      item.tipo?.nombre_tipo,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(termino)
    );
  });

  const dispositivoSeleccionadoDetalle = dispositivos.find(
    (item: any) => String(item.id_dispositivo) === dispositivoSeleccionado
  );

  const limpiarFormularioAgregarDispositivo = () => {
    setAgregarDispositivo(false);
    setDispositivoSeleccionado("");
    setBusquedaDispositivo("");
  };

  const mostrarDispositivoDisponibles = async () => {
    const res = await obtenerDispositivos();

    if (res.success) {
      const idsDelGrupo = new Set(
        (grupo.detalles || [])
          .map((item: any) => item.dispositivos?.id_dispositivo)
          .filter(Boolean)
      );

      const disponibles = res.data.filter(
        (item: any) =>
          item.estatus === "DISPONIBLE" &&
          !idsDelGrupo.has(item.id_dispositivo)
      );

      setDispositivos(disponibles);
      setDispositivoSeleccionado("");
      setBusquedaDispositivo("");
    } else {
      await showAlert("error", res.message, "Error");
      return;
    }

    setAgregarDispositivo(true);
  };

  const handleDispositivo = async () => {

    if (!dispositivoSeleccionado) {
      await showAlert(
        "warning",
        "Debes seleccionar un dispositivo para agregarlo a este grupo.",
        "Agregar"
      );
      return;
    }

    const res = await actualizarGrupoDispositivo(
      Number(dispositivoSeleccionado),
      {
        sid_grupo: grupo.id_grupo,
      }
    );

    if (res.success) {
      await showAlert("success", res.message, "Agregado");
      await cargarDetalle();
      limpiarFormularioAgregarDispositivo();
    } else {
      await showAlert("error", res.message, "Error");
    }
  };


  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-r 
            from-grisClaro via-[#D7D7D7] to-[#C0C0C0]
            dark:from-oscuro-relleno dark:via-oscuro-relleno dark:to-oscuro-fondo 
            text-white p-6">

            {/* BOTÓN X FIJO */}
            <button
              onClick={onBack}
              className="absolute top-4 right-4 p-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

              {/* IZQUIERDA */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-300">
                    Grupo de Equipamiento
                  </p>
                  <h2 className="text-3xl font-bold mt-2 text-gray-600 dark:text-white">
                    CTRL-IMIFE-{String(grupo.numero_control).padStart(3, "0")}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(grupo.estatus)}`}>
                    {grupo.estatus} QR
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold dark:bg-white/10 dark:text-white text-gray-500 bg-white">
                    {grupo.detalles?.length || 0} dispositivos
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold dark:bg-white/10 dark:text-white text-gray-500 bg-white">
                    Alta: {formatDate(grupo.created_at)}
                  </span>
                </div>
                {/* botones  */}
                {!grupoInactivo && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={mostrarDispositivoDisponibles}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primario text-white hover:bg-primario-dark transition shadow-sm hover:shadow-md">
                      <Laptop size={16} />
                      Agregar Dispositivo
                    </button>

                    <button
                      onClick={() => qrRef.current?.download()}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-sky-900 text-white hover:bg-sky-800 transition shadow-sm hover:shadow-md">
                      <QrCode size={16} />
                      Descargar QR
                    </button>
                    {dispositovosEstatus && (

                      <button
                        onClick={() => descargarPdfGrupo(idGrupo, showAlert)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-900 text-white hover:bg-red-950 transition shadow-sm hover:shadow-md"
                      >
                        <FileDown size={16} />
                        Descargar PDF
                      </button>
                    )
                    }

                    {grupo.detalles?.length > 1 && (
                      <button
                        onClick={eliminarGrupoCompleto}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition shadow-sm hover:shadow-md">
                        <Trash2 size={16} />
                        Dar de Baja Todo
                      </button>
                    )}


                  </div>
                )}

                {/* agregar dispositivo */}
                {agregarDispositivo && (
                  <div className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4 mb-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white text-black">
                        Busca un dispositivo disponible
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Al agregar un dispositivo quedará registrada en observaciones.
                      </p>
                    </div>

                    <input
                      value={busquedaDispositivo}
                      onChange={(e) => setBusquedaDispositivo(e.target.value)}
                      placeholder="Busca por inventario, serie, modelo o marca"
                      className="w-full rounded-lg border border-slate-300 p-2 dark:bg-oscuro dark:border-slate-700 text-black dark:text-white"
                    />

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-oscuro-fondo max-h-56 overflow-y-auto">
                      {dispositivos.length === 0 ? (
                        <p className="p-3 text-sm text-slate-500">
                          No hay dispositivos disponibles para agregar.
                        </p>
                      ) : dispositivosFiltrados.length === 0 ? (
                        <p className="p-3 text-sm text-slate-500">
                          No se encontraron dispositivos con esa busqueda.
                        </p>
                      ) : (
                        dispositivosFiltrados.slice(0, 8).map((item: any) => {
                          const seleccionado =
                            String(item.id_dispositivo) === dispositivoSeleccionado;

                          return (
                            <button
                              key={item.id_dispositivo}
                              type="button"
                              onClick={() => {
                                setDispositivoSeleccionado(String(item.id_dispositivo));
                                setBusquedaDispositivo(obtenerEtiquetaDispositivo(item));
                              }}
                              className={`w-full text-left px-3 py-2 border-b last:border-b-0 transition ${seleccionado
                                ? "bg-primario/10 text-primario"
                                : "hover:bg-slate-100 dark:hover:bg-oscuro-relleno text-slate-700 dark:text-slate-200"
                                }`}
                            >
                              <p className="text-sm font-medium">
                                {item.numero_inventario || "Sin inventario"}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {obtenerEtiquetaDispositivo(item)}
                              </p>
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3 bg-white/70 dark:bg-oscuro-fondo/80">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Estado destino
                      </p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                        El grupo esta {asignacionActiva ? "asignado" : "disponible"}, por lo que el dispositivo se guardara como{" "}
                        <span className="font-semibold">{estatusDispositivoDestino}</span>.
                      </p>
                    </div>

                    {dispositivoSeleccionadoDetalle && (
                      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-oscuro-fondo">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Dispositivo seleccionado
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white">
                          {obtenerEtiquetaDispositivo(dispositivoSeleccionadoDetalle)}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={limpiarFormularioAgregarDispositivo}
                        className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-300 text-slate-700 hover:bg-slate-400"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDispositivo}
                        className="px-3 py-2 rounded-lg text-sm font-semibold bg-primario text-white hover:bg-primario-dark"
                      >
                        Guardar asignación
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* DERECHA */}
              <div className="flex items-start gap-4 mr-10 lg:mr-12">
                <QrEquipamiento
                  ref={qrRef}
                  codigo={codigoGrupo}
                  size={120} />
              </div>

            </div>
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
          {grupo.detalles?.map((item: any) => {
            const d = item.dispositivos;
            const esBaja = d.estatus === "BAJA";
            return (
              <Card
                key={item.id}
                className={`rounded-2xl border shadow-sm transition-shadow
                  ${esBaja
                    ? "bg-red-50 border-red-200 opacity-75 dark:bg-red-950/20 dark:border-red-900"
                    : "bg-white hover:shadow-md dark:bg-oscuro-relleno"
                  }`}
              >
                <CardContent className="p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    {/* IZQUIERDA */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-oscuro-fondo flex items-center justify-center">
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

                    {/* DERECHA */}
                    <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-3 md:items-end md:justify-end">
                      {editandoId === d.id_dispositivo ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => guardarEdicion(d.id_dispositivo)}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-camel text-white hover:bg-secundario"
                          >
                            Actualizar
                          </button>

                          <button
                            onClick={cancelarEdicion}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-gray-400 text-white hover:bg-gray-500"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : esBaja ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(d.estatus)}`}>
                          {d.estatus}
                        </span>
                      ) : (
                        <>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(d.estatus)}`}>
                            {d.estatus}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => iniciarEdicion(d)}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-white hover:bg-amber-500"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => eliminarDispositivo(d.id_dispositivo)}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600">
                              Baja
                            </button>
                          </div>
                        </>
                      )}
                    </div>


                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4">
                      <p className="text-xs uppercase text-slate-500 dark:text-zinc-400 mb-1">Número de Serie</p>
                      {editandoId === d.id_dispositivo ? (
                        <input
                          value={formEdicion.numero_serie}
                          onChange={(e) => handleChangeEdicion("numero_serie", e.target.value)}
                          className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800 dark:text-white break-all">
                          {formatValue(d.numero_serie)}
                        </p>
                      )}
                      {/* <p className="font-semibold text-slate-800 dark:text-white break-all">
                        {formatValue(d.numero_serie)}
                      </p> */}
                    </div>

                    <div className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4">
                      <p className="text-xs uppercase text-slate-500 dark:text-zinc-400 mb-1">Número de Inventario</p>
                      {editandoId === d.id_dispositivo ? (
                        <input
                          value={formEdicion.numero_inventario}
                          onChange={(e) => handleChangeEdicion("numero_inventario", e.target.value)}
                          className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800 dark:text-white break-all">
                          {formatValue(d.numero_inventario)}
                        </p>
                      )}

                    </div>

                    <div className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4">
                      <p className="text-xs uppercase text-slate-500 dark:text-zinc-400 mb-1">Service Tag</p>
                      {editandoId === d.id_dispositivo ? (
                        <input
                          value={formEdicion.service_tag}
                          onChange={(e) => handleChangeEdicion("service_tag", e.target.value)}
                          className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800 dark:text-white break-all">
                          {formatValue(d.service_tag)}
                        </p>
                      )}

                    </div>

                    {/* <div className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4">
                      <p className="text-xs uppercase text-slate-500 dark:text-zinc-400 mb-1">ID Dispositivo</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {formatValue(d.id_dispositivo)}
                      </p>
                    </div> */}
                  </div>
                  {["DESKTOP", "LAPTOP", "MAC"].includes(d.tipo?.nombre_tipo) && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                        Especificaciones técnicas
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 rounded-xl border p-3">
                          <Cpu className="w-4 h-4 mt-0.5 text-sky-600" />
                          <div>
                            <p className="text-xs text-slate-500 uppercase dark:text-zinc-400">Procesador</p>
                            {editandoId === d.id_dispositivo ? (
                              <input
                                value={formEdicion.procesador}
                                onChange={(e) => handleChangeEdicion("procesador", e.target.value)}
                                className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white mt-1"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-800 dark:text-white">
                                {formatValue(d.procesador)}
                              </p>

                            )}

                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border p-3">
                          <MemoryStick className="w-4 h-4 mt-0.5 text-sky-600" />
                          <div>
                            <p className="text-xs text-slate-500 uppercase dark:text-zinc-400">RAM</p>
                            {editandoId === d.id_dispositivo ? (
                              <input
                                value={formEdicion.ram}
                                onChange={(e) => handleChangeEdicion("ram", e.target.value)} type="number"
                                className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white mt-1"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-800 dark:text-white">
                                {d.ram ? `${d.ram} GB` : "No registrado"}
                              </p>
                            )}

                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border p-3">
                          <HardDrive className="w-4 h-4 mt-0.5 text-sky-600" />
                          <div>
                            <p className="text-xs text-slate-500 uppercase dark:text-zinc-400">Disco Duro</p>
                            {editandoId === d.id_dispositivo ? (
                              <input
                                value={formEdicion.disco_duro}
                                onChange={(e) => handleChangeEdicion("disco_duro", e.target.value)} type="number"
                                className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white mt-1"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-800 dark:text-white">
                                {d.disco_duro ? `${d.disco_duro} GB` : "No registrado"}
                              </p>
                            )}

                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border p-3">
                          <Network className="w-4 h-4 mt-0.5 text-sky-600" />
                          <div>
                            <p className="text-xs text-slate-500 uppercase dark:text-zinc-400">MAC Ethernet</p>
                            {editandoId === d.id_dispositivo ? (
                              <input
                                value={formEdicion.mac_ethernet}
                                onChange={(e) => handleChangeEdicion("mac_ethernet", e.target.value)} type="number"
                                className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white mt-1"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-800 dark:text-white break-all">
                                {formatValue(d.mac_ethernet)}
                              </p>
                            )}

                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border p-3 md:col-span-2">
                          <Network className="w-4 h-4 mt-0.5 text-sky-600" />
                          <div>
                            <p className="text-xs text-slate-500 uppercase dark:text-zinc-400">MAC WiFi</p>
                            {editandoId === d.id_dispositivo ? (
                              <input
                                value={formEdicion.mac_wifi}
                                onChange={(e) => handleChangeEdicion("mac_wifi", e.target.value)} type="number"
                                className="w-full rounded-lg border border-primario dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-black dark:text-white mt-1"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-800 dark:text-white break-all">
                                {formatValue(d.mac_wifi)}
                              </p>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  }


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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">

              {/* IZQUIERDA */}
              <div className="flex items-center gap-3">
                <UserRound className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Asignación
                </h3>
              </div>

              {/* DERECHA (BOTÓN) */}
              {!grupoInactivo && (

                <button
                  onClick={handleAccionAsignacion}
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${asignacionActiva
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primario hover:bg-primario-dark"
                    }`}
                >
                  {asignacionActiva
                    ? "Quitar Asignación"
                    : "Asignar"}
                </button>
              )}

            </div>

            {!asignacionActiva && mostrarAsignacion && !grupoInactivo && (
              <div className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4 mb-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Selecciona un servidor público activo
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    La asignación quedará registrada en observaciones.
                  </p>
                </div>

                <select
                  value={sidEmpleadoSeleccionado}
                  onChange={(e) => setSidEmpleadoSeleccionado(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-oscuro-fondo px-3 py-2 text-sm text-slate-800 dark:text-white"
                  disabled={cargandoServidores}
                >
                  <option value="">
                    {cargandoServidores
                      ? "Cargando servidores públicos..."
                      : "Selecciona un servidor público"}
                  </option>
                  {servidoresPublicos.map((empleado: any) => (
                    <option key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombre} {empleado.apellidos}
                      {empleado.area?.nombre_area ? ` - ${empleado.area.nombre_area}` : ""}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setMostrarAsignacion(false);
                      setSidEmpleadoSeleccionado("");
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-300 text-slate-700 hover:bg-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={asignarGrupoSeleccionado}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-primario text-white hover:bg-primario-dark"
                  >
                    Guardar asignación
                  </button>
                </div>
              </div>
            )}

            {grupo.asignaciones?.length > 0 ? (
              <div className="space-y-4 max-h-90 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600">
                {grupo.asignaciones.map((a: any) => (
                  <div
                    key={a.id_asignacion}
                    className="rounded-xl border bg-slate-50 dark:bg-oscuro-relleno p-4"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {a.asignacionEmpleado?.nombre} {a.asignacionEmpleado?.apellidos}
                    </p>

                    <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Área: {formatValue(a.asignacionEmpleado?.area?.nombre_area)}
                      </p>
                      <p>Fecha de asignación: {formatDate(a.fecha_asignacion)}</p>

                      <p>
                        Estatus:
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(a.estatus)}`}>
                          {a.estatus}
                        </span>

                      </p>
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

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-5">
              <StickyNote className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Observaciones
              </h3>
            </div>

            {/* LISTA */}
            {grupo.observaciones?.length > 0 ? (
              <div className="max-h-64 overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600">
                {grupo.observaciones.map((obs: any) => {
                  const styles = getTipoStyles(obs.tipo);

                  return (
                    <div
                      key={obs.id}
                      className={`rounded-xl border-l-4 p-4 shadow-sm ${styles.border} ${styles.bg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/70 dark:bg-black/20 ${styles.text}`}
                        >
                          {obs.tipo}
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatDate(obs.created_at)}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 dark:text-slate-100">
                        {obs.comentario}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 mb-6">
                No hay observaciones registradas.
              </p>
            )}

            {/* FORMULARIO */}
            {!grupoInactivo && (
              <div className="space-y-3">
                <textarea
                  value={comentarioTexto}
                  onChange={(e) => setComentarioTexto(e.target.value)}
                  placeholder="Escribe una observación..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-oscuro-fondo p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                />

                <div className="flex justify-end">
                  <button
                    onClick={agregarComentario}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-primario text-white hover:bg-primario-dark transition">
                    Agregar observación
                  </button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>

  );
}
