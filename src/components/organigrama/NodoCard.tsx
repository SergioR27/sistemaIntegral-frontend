import { useState, useEffect } from "react";
import { Pencil, UserX, History, Trash, CircleX, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  nodeDatum: any;
  onEditar: (data: any) => void;
  onDelete: (data: any) => void;
  viewHistory: (data: any) => void;
};



export default function NodoCard({ nodeDatum, onEditar, onDelete, viewHistory }: Props) {

  const [viewMode, setViewMode] = useState<
    "normal" | "baja" | "historial"
  >("normal");

  const [fechaFin, setFechaFin] = useState("");
  const [historial, setHistorial] = useState<any[]>([]);
  const titular = nodeDatum.attributes?.titular;


  const handleModoBaja = () => {
    setFechaFin("");     // limpiar fecha
    setViewMode("baja");   // entrar modo baja
  };

  const handleConfirmBaja = async () => {

    const result = await onDelete(nodeDatum.attributes?.id_nombramiento, fechaFin);

    if (result.success) {
      setFechaFin("");
      setViewMode("normal");
    }
  };

  const handleViewHistory = async () => {

    const res = await viewHistory(
      nodeDatum.id
    );


    if (res?.success) {
      setHistorial(res.data);
      setViewMode("historial");   // 🔥 AQUÍ CAMBIA LA VISTA
    }
  };

  return (
    <foreignObject width={300} height={190} x={-150} y={-95}>


      {viewMode === "baja" && (
        <div className="bg-white dark:bg-oscuro-fondo  border shadow-md rounded-2xl p-4 pt-6 h-40 flex flex-col justify-between">

          <div className="flex items-center justify-between mb-2">

            {/* TITULO */}
            <div className="text-center flex-1">
              <p className="text-sm font-bold text-primario leading-tight">
                {titular}
              </p>
            </div>

            {/* BOTÓN CERRAR */}
            <button
              className="ml-2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-primario-dark transition"
              onClick={() => setViewMode("normal")}
            >
              <CircleX size={16} />
            </button>

          </div>

          {!fechaFin && (
            <p className="text-xs text-red-500">
              La fecha de baja es obligatoria
            </p>
          )}
          <input
            type="date"
            className={`border rounded p-2 text-sm mb-1 ${!fechaFin ? "border-red-400" : ""
              }`}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />


          <div className="flex justify-end gap-1">
            <button
              disabled={!fechaFin}
              className={`px-2 py-1.5 text-sm rounded ${!fechaFin
                ? "cursor-not-allowed text-black dark:text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              onClick={() => {
                handleConfirmBaja()
              }}
            >
              <Trash size={20} />

            </button>
          </div>

        </div>
      )}

      {viewMode === "historial" && (
        <div className="bg-white dark:bg-oscuro-fondo  border shadow-md rounded-2xl p-4 h-40 flex flex-col justify-between">

          <div className="flex items-center justify-between mb-2">

            {/* TITULO */}
            <div className="text-center flex-1">
              <p className="text-[11px] uppercase text-gray-400 font-semibold leading-tight">
                Historial de
              </p>

              <p className="text-sm font-bold text-primario leading-tight">
                {nodeDatum.name}
              </p>
            </div>

            {/* BOTÓN CERRAR */}
            <button
              className="ml-2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-primario-dark transition"
              onClick={() => setViewMode("normal")}
            >
              <CircleX size={16} />
            </button>

          </div>


          <div className="overflow-y-auto text-xs space-y-1">
            {historial.map((h, i) => (
              <div
                key={i}
                className="border rounded-xl p-3 mb-2 bg-gray-50 dark:bg-oscuro-fondo hover:shadow transition"
              >
                {/* HEADER */}
                <div className="flex items-start justify-between gap-2">

                  {/* NOMBRE */}
                  <div className="flex-1">
                    <p className="font-semibold text-[12px] leading-tight text-gray-700 dark:text-gray-100">
                      {h.empleado.nombre} {h.empleado.apellidos}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {h.fecha_inicio} — {h.fecha_fin || "ACTUAL"}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap
                  ${h.activo
                        ? "bg-green-100 text-green-700 dark:bg-green-600 dark:text-white"
                        : "bg-red-100 text-red-600 dark:bg-red-500 dark:text-white"
                      }`}
                  >
                    {h.activo ? "ACTIVO" : "BAJA"}
                  </span>

                </div>

                {/* FOOTER */}
                {h.documento_nombramiento && (
                  <div className="flex justify-end mt-2">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/uploads/nombramientos/${h.documento_nombramiento}`}
                      target="_blank"
                      className="text-[11px] px-3 py-1 rounded-md bg-primario text-white hover:bg-primario/90 transition"
                    >
                      Ver documento
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>



        </div>
      )}
      {viewMode === "normal" && (
        <div className="relative bg-white dark:bg-oscuro-fondo  border dark:border-gray-600 shadow-md rounded-2xl p-4 pt-6 hover:shadow-lg transition">

          {/* AVATAR */}
          <div className="absolute top-0 left-0 -translate-x-3 -translate-y-3 p-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow">
              <AvatarFallback className="bg-primario text-white">
                {titular ? titular.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* AREA */}
          <div
            className={`text-xs uppercase text-gray-400 font-semibold text-center break-words leading-tight pl-2 ${nodeDatum.name.length > 60 ? "pr-6" : "pr-2"
              }`}
          >
            {nodeDatum.name}
          </div>

          {/* CARGO */}
          <div className="text-sm font-bold text-primario text-center mt-2">
            {nodeDatum.attributes?.cargo || "VACANTE"}
          </div>

          {/* TITULAR */}
          <div className="text-xs text-gray-600 dark:text-gray-200 text-center mt-2">
            {titular || "SIN TITULAR"}
          </div>

          {/* ACCIONES */}
          {nodeDatum.attributes?.sid_empleado ?
            <div className="flex justify-end gap-2 mt-4">

              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => onEditar(nodeDatum.attributes)}>
                <Pencil size={16} />
              </button>

              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleModoBaja}
              >
                <Trash size={16} />
              </button>

              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleViewHistory}>
                <History size={16} />
              </button>

            </div>

            : ""}


        </div>
      )}


    </foreignObject>
  );
}