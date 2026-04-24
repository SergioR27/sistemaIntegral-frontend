import Header from "@/components/Header";
import { useState } from "react";
import Marcas from "./Marcas";
import Modelos from "./Modelos";
import TiposEquipamiento from "./TiposEquipamiento";

export default function Catalogos() {

  const [tabActiva, setTabActiva] = useState("marcas");
  const tabs = [
    { id: "marcas", label: "Marcas" },
    { id: "modelos", label: "Modelos" },
    { id: "equipamiento", label: "Tipos de Equipamiento" },
  ];

  return (
    <div className="p-0 sm:p-4 lg:p-8 max-w-[2200px] mx-auto w-full">
      <Header
        titulo="Cátalogo de Equipamiento"
        subTitulo="Administración de marcas, modelo y tipos de dispositivos"
      />
      <div className="bg-white rounded-xl shadow-sm border p-4 dark:bg-oscuro-relleno dark:border-oscuro-redondear space-y-4 mb-4 h-max">
        <div className="flex gap-2 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`px-6 py-4 front-headline border-b-2 transition-all ${tabActiva === tab.id
                ? "text-primario border-primario font-bold"
                : "text-on-surface-variant/60 hover:text-on-surface"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-7">
          {tabActiva === "marcas" &&
            <Marcas />
          }
          {tabActiva === "modelos" &&
            <Modelos />
          }
          {tabActiva === "equipamiento" &&
            <TiposEquipamiento />
          }
        </div>
      </div>
    </div>
  );
}