import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Asignacion() {

  const equipos = [
    {
      id: 1,
      nombre: "Dell Latitude 5420",
      serie: "5GQ-482-X91",
      activo: "CTRL-IMIFE-125",
    },
    {
      id: 2,
      nombre: "MacBook Air M2",
      serie: "C02-XJ1-M2Y",
      activo: "CTRL-IMIFE-005",
    },
    {
      id: 3,
      nombre: "Lenovo ThinkPad X1",
      serie: "LNV-881-Z22",
      activo: "CTRL-IMIFE-189",
    },
    {
      id: 4,
      nombre: "Dell Latitude 5420",
      serie: "5GQ-482-X91",
      activo: "CTRL-IMIFE-125",
    },
    {
      id: 5,
      nombre: "MacBook Air M2",
      serie: "C02-XJ1-M2Y",
      activo: "CTRL-IMIFE-005",
    },
    {
      id: 6,
      nombre: "Lenovo ThinkPad X1",
      serie: "LNV-881-Z22",
      activo: "CTRL-IMIFE-189",
    },
  ];

  const [selectedId, setSelectedId] = useState<number | null>(1);

  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">

      <Header
        titulo="Selección de Equipo"
        subTitulo="Busque y seleccione el equipo que será asignado"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2 pb-2 lg:pb-0">
          <Card>
            <CardContent className="p-4 flex flex-col gap-4">
              {/* Buscador */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#85666e]">
                  <span className="material-symbols-outlined">search</span>
                </span>
                <Input
                  placeholder="Buscar dispositivo..."
                  className="pl-12 text-lg bg-[#f4f1f1]"
                />
              </div>

              <p className="text-sm font-bold uppercase tracking-wider text-primario">
                Equipos disponibles
              </p>

              {/* Scroll */}
              <ScrollArea className="h-[55vh] lg:h-[420px] pr-3">
                <div className="flex flex-col gap-3">
                  {equipos.map((equipo) => {
                    const selected = equipo.id === selectedId;

                    return (
                      <div
                        key={equipo.id}
                        onClick={() => setSelectedId(equipo.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all",
                          selected
                            ? "border-2 border-primario bg-primario/5"
                            : "border border-[#e4dcdf] hover:border-primario/50 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "p-3 rounded-lg",
                              selected ? "bg-primario/20" : "bg-[#f4f1f1]"
                            )}
                          >
                            <span
                              className={cn(
                                "material-symbols-outlined",
                                selected ? "text-primario" : "text-[#85666e]"
                              )}
                            >
                              laptop_mac
                            </span>
                          </div>

                          <div>
                            <p className="font-bold text-lg">{equipo.nombre}</p>
                            <p className="text-sm text-[#85666e]">
                              SN: {equipo.serie} | Activo: {equipo.activo}
                            </p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "material-symbols-outlined",
                            selected ? "text-primario" : "text-[#e4dcdf]"
                          )}
                        >
                          {selected
                            ? "check_circle"
                            : "radio_button_unchecked"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="mb-2 mt-2">
                <p className="text-sm font-bold uppercase tracking-wider text-primario">
                  Seleccionar Personal
                </p>
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-primario/40 bg-primario/5 hover:border-primario/70 transition cursor-pointer mt-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primario/20 p-3 rounded-lg">
                      <span className="material-symbols-outlined text-primario">
                        person_search
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-sm">Usuario no seleccionado</p>
                      <p className="text-xs text-[#85666e]">
                        Haga clic para buscar y asignar responsable
                      </p>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-primario/60">
                    chevron_right
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <aside className="sticky top-24">
            <Card className="overflow-hidden">
              {/* Header */}
              <div className="bg-[#f4f1f1] px-6 py-4 border-b">
                <h3 className="font-bold text-sm uppercase tracking-wider text-primario">
                  Resumen de Asignación
                </h3>
              </div>

              <CardContent className="p-6 flex flex-col gap-6">
                {/* Equipo */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase text-[#85666e]">
                    Equipo seleccionado
                  </p>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primario text-sm mt-0.5">
                      laptop_mac
                    </span>
                    <div>
                      <p className="text-sm font-bold">Dell Latitude 5420</p>
                      <p className="text-xs text-[#85666e]">Activo: CTRL-IMIFE-525</p>
                    </div>
                  </div>
                </div>

                {/* Usuario pendiente */}
                <div className="flex flex-col gap-2 opacity-50">
                  <p className="text-xs font-bold uppercase text-[#85666e]">
                    Usuario responsable
                  </p>
                  <div className="flex items-center gap-3 border-2 border-dashed p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[#85666e]">
                      person_search
                    </span>
                    <p className="text-xs italic">Pendiente de selección</p>
                  </div>
                </div>

                {/* Fecha y ubicación */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase text-[#85666e]">
                    Fecha y ubicación
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#85666e] text-sm">
                      calendar_today
                    </span>
                    <p className="text-sm">23 Enero, 2026</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#85666e] text-sm">
                      location_on
                    </span>
                    <p className="text-sm">Oficinas Centrales, Toluca</p>
                  </div>
                </div>

                {/* Botón */}
                <div className="mt-4">
                  <Button
                    disabled
                    className="w-full bg-primario/20 text-[#85666e] py-6 cursor-not-allowed"
                  >
                    Confirmar asignación
                  </Button>
                  <p className="text-[10px] text-center mt-2 text-[#85666e]">
                    Complete todos los pasos para habilitar la confirmación.
                  </p>
                </div>
              </CardContent>

              {/* Info */}
              <div className="bg-primario/5 p-4 m-4 rounded-lg border border-primario/20">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primario">
                    info
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#5a444a]">
                    Este registro genera automáticamente un acta de responsabilidad
                    administrativa firmada por ambas partes.
                  </p>
                </div>
              </div>
            </Card>
          </aside>

        </div>

      </div>
    </div>
  );
}