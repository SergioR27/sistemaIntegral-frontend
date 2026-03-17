import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { X, Mail, MapPin, IdCard, BadgeCheck } from "lucide-react";
import QRCard from "./QRCard";

type Props = {
  empleado: Empleado;
  onClose: () => void;
};
// type Estatus = "activo" | "baja" | "licencia";

export default function PersonalCard({ empleado, onClose }: Props) {

  // const estatusColor: Record<Estatus, string> = {
  //   activo: "bg-green-600 text-white",
  //   baja: "bg-red-500 text-white",
  //   licencia: "bg-yellow-500 text-black",
  // };

  return (
    <Card className="py-0 w-[380px] overflow-hidden rounded-2xl shadow-md relative">

      {/* BOTÓN CERRAR */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 z-20 bg-muted hover:bg-gray-300"
        onClick={onClose}
      >
        <X size={18} />
      </Button>

      {/* HEADER */}
      <div className="relative h-44 w-full overflow-hidden">

        {/* Imagen institucional */}
        <img
          src="/src/assets/card.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 " />

        <div className="absolute bottom-0 left-0 w-full h-12 bg-white dark:bg-[#2A1D21] rounded-tl-[20px]" />

        {/* AVATAR + NOMBRE */}
        <div className="absolute bottom-5 left-6 right-6 z-9 flex items-center justify-between">

          <Avatar className="h-12 w-12 border-4 border-white shadow-md">
            <AvatarFallback>
              {empleado.nombre?.[0]}
              {empleado.apellidos?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="text-right text-black dark:text-white translate-y-8">
            <h3 className="font-semibold text-sm md:text-base lg:text-lg leading-snug ">
              {empleado.nombre} {empleado.apellidos}
            </h3>


          </div>

        </div>

      </div>

      {/* BODY */}
      <CardContent className="pt-1 grid grid-cols-2 gap-3 text-sm">

        <div className="col-span-2 text-right text-zinc-800 dark:text-white">
          <p className="text-xs opacity-90  break-words">
            {empleado.area?.nombre_area}
          </p>
        </div>


        <div className="flex items-center gap-2 col-span-2">
          <BadgeCheck size={24} className="text-primario" />
          <span className="font-medium">Categoría:</span>
          <span className="text-muted-foreground">{empleado.categoria}</span>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <IdCard size={24} className="text-primario" />
          <span className="font-medium">CURP:</span>
          <span className="text-muted-foreground">{empleado.curp}</span>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <BadgeCheck size={24} className="text-primario" />
          <span className="font-medium">ISSEMYM:</span>
          <span className="text-muted-foreground">{empleado.nip_issemyn}</span>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <Mail size={24} className="text-primario" />
          <span className="font-medium">Correo:</span>
          <span className={empleado.correo ? "text-muted-foreground" : "bg-amber-200 rounded rounded-sm p-1 text-xs dark:text-black"}>{empleado.correo ? empleado.correo : "Pendiente"}</span>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <MapPin size={24} className="text-primario" />
          <span className="font-medium">Municipio:</span>
          <span className="text-muted-foreground">{empleado.municipio}</span>
        </div>

      </CardContent>



      {/* FOOTER CON QR */}
      <QRCard
        empleado={empleado}
      />

    </Card>
  );
}