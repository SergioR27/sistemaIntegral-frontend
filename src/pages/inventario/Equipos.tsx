import { useEffect, useState, useMemo } from "react";
import Form from "@/components/Form";
import Header from "@/components/Header";
import Wizard from "@/components/Wizard";
import DataTable from "@/components/DataTable";
import { obtenerTiposEquipamientos } from "@/functions/ActionsTiposEquipamientos";
import { obtenerModelos } from "@/functions/ActionsModelos";
import { useAlert } from "@/components/AlertContext";
import { obtenerEmpleados } from "@/functions/ActionsEmpleados";
import { handleSave, obtenerCodigoPreview, obtenerDispositivos } from "@/functions/ActionsDispositivos";
import QrEquipamiento from "./QrEquipamiento";
import { Checkbox } from "@/components/ui/checkbox";
import type { Column } from "@/components/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Cpu, Keyboard, Mouse, Laptop, PcCase, Printer, Cable, BatteryCharging, LaptopMinimal } from "lucide-react";
import DetallesGrupo from "./DetallesGrupos";

type Dispositivos = {
  id_dispositivo: number;
  sid_tipo_equipamiento: number;
  sid_modelo: number;
  numero_serie: number;
  service_tag: string;
  numero_inventario: string;
  estatus: string;
  procesador: string;
  ram: number;
  disco_duro: number;
  mac_ethernet: string;
  mac_wifi: string;
  modelo: string;
};

type TipoEquipo = {
  id_tipo_equipamiento: number;
  nombre_tipo: string;
};

type Modelo = {
  id_modelo: number;
  nombre_modelo: string;
};

type Empleados = {
  id_empleado: number,
  nombre: string,
  apellidos: string,
};

type CodigoPreview = {
  numero_control: number;
  codigo_qr: string;
};

export default function Equipos() {

  const { showAlert } = useAlert();
  const [openModal, setOpenModal] = useState(false);
  const [tipoEquipamientos, setTipoEquipamientos] = useState<TipoEquipo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [dispositivoEditando, setDispositivoEditando] = useState<Dispositivos | null>(null);
  const [componentesData, setComponentesData] = useState<any>({});
  const [personal, setPersonal] = useState<Empleados[]>([]);
  const [asignacionData, setAsignacionData] = useState<any>({});
  const [codigo, setCodigo] = useState<CodigoPreview | null>(null);
  const [sinAsignacion, setSinAsignacion] = useState(false);

  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [generalData, setGeneralData] = useState<any>({});
  const [validateGeneral, setValidateGeneral] = useState<() => boolean>(() => () => true);
  const [validateAsignacion, setValidateAsignacion] = useState<() => boolean>(() => () => true);
  const [dispositivos, setDispositivos] = useState<Dispositivos[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null);

  const getIconByTipo = (tipo?: string) => {
    switch (tipo?.toUpperCase()) {
      case "DESKTOP":
        return <PcCase className="w-4 h-4 text-blue-500" />;
      case "MONITOR":
        return <Monitor className="w-4 h-4 text-purple-500" />;
      case "TECLADO":
        return <Keyboard className="w-4 h-4 text-orange-500" />;
      case "MOUSE":
        return <Mouse className="w-4 h-4 text-pink-500" />;
      case "LAPTOP":
        return <Laptop className="w-4 h-4 text-sky-500" />;
      case "IMPRESORA":
        return <Printer className="w-4 h-4 text-gray-500" />;
      case "CARGADOR":
        return <Cable className="w-4 h-4 text-rose-500" />;
      case "NO BREAK":
        return <BatteryCharging className="w-4 h-4 text-green-500" />;
      case "MAC":
        return <LaptopMinimal className="w-4 h-4 text-yellow-600" />;
      default:
        return <Cpu className="w-4 h-4 text-gray-400" />;
    }
  };


  // CARGA DATOS
  useEffect(() => {
    obtenerTiposEquipamientos().then((res) => {
      if (res.success) setTipoEquipamientos(res.data);
    });

    obtenerModelos().then((res) => {
      if (res.success) setModelos(res.data);
    });

    obtenerEmpleados().then((res) => {
      if (res.success) setPersonal(res.data);
    });

    obtenerCodigoPreview().then((res) => {
      if (res.success) setCodigo(res.data);
    });

    obtenerDispositivos().then((res) => {
      if (res.success) setDispositivos(res.data);
    });
  }, []);

  const tipos_flujo = {
    GRUPO: [1, 6, 9], // 👈 IDs reales
    DIRECTO: [2, 4, 5, 7, 8],
  };

  const tipoComponenteId: Record<string, number> = {
    MONITOR: 2,
    TECLADO: 4,
    MOUSE: 5,
    CARGADOR: 10,
  };

  // buscar el nombre del modelo
  const getNombreModelo = (id: number) => {
    return modelos.find((m) => m.id_modelo === id)?.nombre_modelo || "Equipo";
  };


  const getNombreTipo = (id: number) => {
    return (
      tipoEquipamientos.find(
        (t) => t.id_tipo_equipamiento === id
      )?.nombre_tipo?.toUpperCase() || ""
    );
  };


  // const esGrupo = (id: number) =>
  //   tipos_flujo.GRUPO.includes(getNombreTipo(id));
  const esGrupo = (id: number) => tipos_flujo.GRUPO.includes(id);

  const esDirecto = (id: number) => tipos_flujo.DIRECTO.includes(id);

  const camposFormulario = useMemo(() => {
    const campos = [
      {
        name: "sid_tipo_equipamiento", // 🔥 FIX
        label: "Tipo Equipamiento",
        type: "select",
        required: true,
        options: tipoEquipamientos.map((a) => ({
          label: a.nombre_tipo,
          value: a.id_tipo_equipamiento,
        })),
      },
      {
        name: "sid_modelo",
        label: "Modelo",
        type: "autocomplete",
        required: true,
        options: modelos.map((a) => ({
          label: a.nombre_modelo,
          value: a.id_modelo,
        })),
      },
      { name: "numero_serie", label: "Número de Serie", placeholder: "", type: "text", required: true },
      { name: "numero_inventario", label: "Número de Inventario", placeholder: "INV-0000-000", type: "text", required: false },
      { name: "service_tag", label: "Service Tag", type: "text" },
    ];

    // SOLO SI ES GRUPO
    if (tipoSeleccionado && esGrupo(tipoSeleccionado)) {
      campos.push(
        { name: "mac_ethernet", label: "Mac Ethernet", placeholder: "00:00:00:00:00:00", type: "text", required: false },
        { name: "mac_wifi", label: "Mac WiFi", placeholder: "00:00:00:00:00:00", type: "text", required: false },
        { name: "procesador", label: "Procesador", placeholder: "", type: "text", required: false },
        { name: "ram", label: "RAM", placeholder: "GB", type: "number", required: false },
        { name: "disco_duro", label: "Disco Duro", placeholder: "GB", type: "number", required: false }
      );
    }

    return campos;
  }, [tipoEquipamientos, modelos, tipoSeleccionado]);

  // STEPS DINÁMICOS

  const componentes_tipo: Record<number, string[]> = {
    1: ["MONITOR", "TECLADO", "MOUSE"], // Desktop
    6: ["CARGADOR"], // Laptop
    9: ["CARGADOR"], // Mac
  };

  const camposComponente = [
    {
      name: "sid_modelo",
      label: "Modelo",
      type: "autocomplete",
      required: true,
      options: modelos.map((a) => ({
        label: a.nombre_modelo,
        value: a.id_modelo,
      })),
    },
    { name: "numero_serie", label: "Número de Serie", placeholder: "", type: "text", required: true },
    { name: "numero_inventario", label: "Número de Inventario", placeholder: "INV-0000-000", type: "text" },
  ];

  useEffect(() => {
    if (sinAsignacion) {
      setAsignacionData({});
    }
  }, [sinAsignacion]);

  const steps = useMemo(() => {
    const stepGeneral = {
      title: "Información General",
      content: (
        <Form
          title="Agregar Equipo"
          fields={camposFormulario}
          columns={3}
          hideSubmit={true}
          defaultValues={generalData}
          onValidate={(fn) => setValidateGeneral(() => fn)}
          onChange={(values) => {
            setTipoSeleccionado(values.sid_tipo_equipamiento);
            setGeneralData(values);
          }}
          onSubmit={async () => { }}
        />
      ),
    };

    const stepComponentes = {
      title: "Componentes",
      content: (
        <div className="grid grid-cols-1  md:grid-cols-2 gap-6">

          {componentes_tipo[tipoSeleccionado]?.map((tipoComp, index) => (

            <div key={index} className="border rounded-xl p-4 shadow-sm bg-white dark:bg-oscuro-fondo">

              <p className="font-semibold mb-3 text-primario">
                {tipoComp}
              </p>

              <Form
                fields={camposComponente}
                columns={2}
                hideSubmit
                defaultValues={componentesData[tipoComp] || {}}
                onValidate={(fn) => setValidateAsignacion(() => fn)}
                onChange={(values) => {
                  setComponentesData((prev: any) => ({
                    ...prev,
                    [tipoComp]: {
                      ...values,
                      sid_tipo_equipamiento: tipoComponenteId[tipoComp],
                    },
                  }));
                }}
                onSubmit={async () => { }}
              />

            </div>

          ))}

        </div>
      ),
    };

    const stepAsignacion = {
      title: "Asignación",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 🟢 IZQUIERDA */}
          <div className="space-y-6">

            {/* CARD PRINCIPAL */}
            <div className="bg-white dark:bg-oscuro-fondo rounded-2xl shadow p-6">
              <p className="text-xs text-gray-400 uppercase">
                Registro de Activo
              </p>

              <h2 className="text-2xl font-bold text-primario">
                {getNombreModelo(generalData?.sid_modelo)}
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">

                <div>
                  <p className="text-gray-400">Tipo de Equipo</p>
                  <p className="font-semibold">
                    {getNombreTipo(generalData?.sid_tipo_equipamiento)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Número de Serie</p>
                  <p className="font-semibold">
                    {generalData?.numero_serie}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Inventario</p>
                  <p className="font-semibold">
                    {generalData?.numero_inventario}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Estatus</p>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    Disponible
                  </span>
                </div>

              </div>
            </div>

            {/* COMPONENTES */}
            {esGrupo(tipoSeleccionado) && (
              <div className="bg-white dark:bg-oscuro-fondo rounded-2xl shadow p-6">
                <p className="text-2xl font-bold text-primario semibold mb-4">
                  Componentes
                </p>

                <div className="space-y-3">
                  {Object.entries(componentesData).map(([key, value]: any) => (
                    <div
                      key={key}
                      className="flex justify-between items-center border rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium  text-oscuro-redondear">{key}</p>
                        <p className="text-xs text-gray-400">
                          {value?.numero_serie || "Sin serie"}
                        </p>
                      </div>

                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Disponible
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 🔵 DERECHA */}
          <div className="space-y-6">

            {/* ASIGNACIÓN */}
            <div className="bg-white dark:bg-oscuro-fondo rounded-2xl shadow p-6 ">
              <p className="text-2xl font-bold text-primario semibold mb-4">
                Asignar un Servidor Público
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="sinAsignacion"
                  checked={sinAsignacion}
                  onCheckedChange={(checked) => {
                    console.log("valor checkbox:", checked);
                    setSinAsignacion(checked === true);
                  }}
                />
                <label htmlFor="sinAsignacion" className="text-sm">
                  Sin asignación
                </label>
              </div>
              <div className={sinAsignacion ? "opacity-50 pointer-events-none" : ""}>
                <Form
                  fields={[
                    {
                      name: "sid_empleado",
                      label: "Servidor Público",
                      type: "autocomplete",
                      required: true,
                      disabled: sinAsignacion,
                      options: personal.map((p) => ({
                        label: `${p.nombre} ${p.apellidos}`,
                        value: p.id_empleado,
                      })),
                    },
                  ]}
                  columns={1}
                  hideSubmit
                  defaultValues={asignacionData}
                  onValidate={(fn) => setValidateAsignacion(() => fn)}
                  onChange={(values) => {
                    setAsignacionData(values);
                  }}
                  onSubmit={async () => { }}
                />
              </div>

            </div>

            {/* QR (placeholder) */}
            <QrEquipamiento codigo={codigo?.numero_control} />

          </div>
        </div>
      ),
    };

    if (!tipoEquipamientos.length) return [stepGeneral]; // 👈 evita errores

    if (!tipoSeleccionado) return [stepGeneral];

    if (esGrupo(tipoSeleccionado)) {
      return [stepGeneral, stepComponentes, stepAsignacion];
    }

    if (esDirecto(tipoSeleccionado)) {
      return [stepGeneral, stepAsignacion];
    }

    return [stepGeneral];
  }, [tipoSeleccionado, tipoEquipamientos, camposFormulario, generalData, componentesData, personal, modelos, sinAsignacion, asignacionData,]);



  // RESETEAR AL CERRAR
  useEffect(() => {
    if (!openModal) {
      setTipoSeleccionado(null);
      setGeneralData({});
      setComponentesData({});
      setAsignacionData({});
      setSinAsignacion(false);
    }
  }, [openModal]);



  const executeAction = async (action: Promise<any>) => {
    const result = await action;

    if (result.success) {

      await showAlert("success", result.message, "Éxito");

      const res = await obtenerDispositivos();
      if (res.success) setDispositivos(res.data);



    } else {
      await showAlert("error", result.message);
    }

    return result;
  };

  const formatGrupo = (numero?: number) => {
    if (!numero) return "—";
    return `CTRL-IMIFE-${String(numero).padStart(3, "0")}`;
  };

  const statusStyles: Record<string, string> = {
    DISPONIBLE: "bg-green-100 text-green-700",
    ASIGNADO: "bg-blue-100 text-blue-700",
    BAJA: "bg-red-100 text-red-700",
    MANTENIMIENTO: "bg-amber-100 text-amber-700",
  };

  const columns: Column<Dispositivos>[] = [
    {
      key: "equipo",
      label: "Equipo",
      searchableValue: (p) =>
        `${p.modelo?.marca?.nombre_marca || ""} ${p.modelo?.nombre_modelo || ""}`,
      render: (p) => (
        <div className="flex items-center gap-2">
          {getIconByTipo(p.tipo?.nombre_tipo)}

          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {p.modelo?.marca?.nombre_marca || "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {p.modelo?.nombre_modelo || "—"}
            </span>
          </div>
        </div>
      ),
    },

    {
      key: "numero_serie",
      label: "No. Serie",
      searchableValue: (p) => p.numero_serie,
      render: (p) => (
        <span className="font-mono text-xs">
          {p.numero_serie}
        </span>
      ),
    },

    {
      key: "numero_inventario",
      label: "No. Inventario",
      searchableValue: (p) => p.numero_inventario,
      render: (p) => (
        <span className="font-mono text-xs">
          {p?.numero_inventario || "S/N"}
        </span>
      ),
    },

    {
      key: "tipo",
      label: "Tipo",
      searchableValue: (p) => p.tipo?.nombre_tipo || "",
      render: (p) => (
        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
          {p.tipo?.nombre_tipo || "—"}
        </span>
      ),
    },

    {
      key: "estatus",
      label: "Estatus",
      searchableValue: (p) => p.estatus,
      render: (p) => {
        const estilo = statusStyles[p.estatus] || "bg-gray-100 text-gray-600";

        return (
          <span className={`text-xs px-2 py-1 rounded-full ${estilo}`}>
            {p.estatus}
          </span>
        );
      },
    },

    {
      key: "grupo",
      label: "Grupo",
      searchableValue: (p) =>
        formatGrupo(p.grupoDetalle?.[0]?.grupoEquipo?.numero_control),
      render: (p) => (
        <span className="text-xs font-semibold text-primario">
          {formatGrupo(p.grupoDetalle?.[0]?.grupoEquipo?.numero_control)}
        </span>
      ),
    },
  ];

  //valicaciones
  const tieneValor = (value: any) => {
    return value !== undefined && value !== null && String(value).trim() !== "";
  };

  const validarGeneralPaso = async () => {
    const formValido = validateGeneral ? validateGeneral() : true;
    if (!formValido) return false;

    const tieneTipo = !!generalData?.sid_tipo_equipamiento;
    const tieneModelo = !!generalData?.sid_modelo;
    const tieneSerie = tieneValor(generalData?.numero_serie);

    if (tieneTipo && tieneModelo && !tieneSerie) {
      await showAlert(
        "warning",
        "Debes capturar el número de serie para continuar."
      );
      return false;
    }

    return true;
  };

  const validarComponentesPaso = async () => {
    if (!tipoSeleccionado || !esGrupo(tipoSeleccionado)) return true;

    const componentesRequeridos = componentes_tipo[tipoSeleccionado] || [];

    for (const tipoComp of componentesRequeridos) {
      const comp = componentesData?.[tipoComp] || {};
      const tieneModelo = !!comp?.sid_modelo;
      const tieneSerie = tieneValor(comp?.numero_serie);

      if (tieneModelo && !tieneSerie) {
        await showAlert(
          "warning",
          `El componente ${tipoComp} requiere número de serie para continuar.`
        );
        return false;
      }
    }

    return true;
  };

  const validarAsignacionPaso = async () => {
    if (sinAsignacion) return true;

    const formValido = validateAsignacion ? validateAsignacion() : true;
    if (!formValido) return false;

    if (!asignacionData?.sid_empleado) {
      await showAlert(
        "warning",
        "Debes seleccionar un servidor público o marcar 'Sin asignación'."
      );
      return false;
    }

    return true;
  };

  const handleValidateStep = async (currentStep: number) => {
    if (currentStep === 1) {
      return await validarGeneralPaso();
    }

    if (esGrupo(tipoSeleccionado) && currentStep === 2) {
      return await validarComponentesPaso();
    }

    const ultimoPaso = esGrupo(tipoSeleccionado) ? 3 : 2;

    if (currentStep === ultimoPaso) {
      return await validarAsignacionPaso();
    }

    return true;
  };

  const stats = useMemo(() => {
    const total = dispositivos.length;

    const disponibles = dispositivos.filter(d => d.estatus === "DISPONIBLE").length;
    const asignados = dispositivos.filter(d => d.estatus === "ASIGNADO").length;
    const baja = dispositivos.filter(d => d.estatus === "BAJA").length;
    const mantenimiento = dispositivos.filter(d => d.estatus === "MANTENIMIENTO").length;

    return {
      total,
      disponibles,
      asignados,
      baja,
      mantenimiento,
    };
  }, [dispositivos]);


  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">
      {!grupoSeleccionado ? (
        <>
          <Header
            titulo="Inventario de Equipos"
            subTitulo="Gestión centralizada de activos y dispositivos institucionales."
            botonTexto="Agregar Nuevo Dispositivo"
            open={openModal}
            setOpen={setOpenModal}
            modalContent={() => (
              <Wizard
                steps={steps}
                close={() => setOpenModal(false)}
                onValidateStep={handleValidateStep}
                onFinish={async () => {
                  const payload = {
                    general: generalData,
                    componentes: componentesData,
                    asignacion: asignacionData,
                  };

                  await executeAction(handleSave(payload));

                  setOpenModal(false);
                }}
              />
            )}
          />

          <DataTable<Dispositivos>
            titulo="Dispositivos Registrados"
            columns={columns}
            data={dispositivos}
            onView={(row) => {
              const idGrupo = row.grupoDetalle?.[0]?.grupoEquipo?.id_grupo;

              if (idGrupo) {
                setGrupoSeleccionado(idGrupo);
              }
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-5">
            {/* card 1 */}

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
                  Total Dispositivos
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-950 dark:text-white">
                    {stats.total}
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* card 2 */}

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <span className="material-symbols-outlined text-3xl">
                      check_circle
                    </span>
                  </div>
                </div>
                <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
                  Total Asignados
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-950 dark:text-white">
                    {stats.asignados}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* card 3 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                    <span className="material-symbols-outlined">
                      install_desktop
                    </span>
                  </div>
                </div>
                <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
                  Total Disponibles
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-950 dark:text-white">
                    {stats.disponibles}
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* card 4 */}
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
                    {stats.mantenimiento}
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* card 5 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                    <span className="material-symbols-outlined">
                      devices_off
                    </span>
                  </div>
                </div>
                <h4 className="text-stone-700 text-sm font-semibold uppercase mb-1">
                  Baja
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-950 dark:text-white">
                    {stats.baja}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <DetallesGrupo
            idGrupo={grupoSeleccionado}
            onBack={() => setGrupoSeleccionado(null)}
          />
        </div>
      )}
    </div>


  );
}