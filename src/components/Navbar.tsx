import { useLocation } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sic/oficios": "SIC / Oficios",
  "/sic/registros": "SIC / Registros",
  "/inventario/equipos": "Inventario / Equipos",
  "/personal": "Personal",
};

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { pathname } = useLocation();

  const title =
    routeTitles[pathname] ?? "Sistema Integral";

  return (
    <header className="h-14 bg-grisClaro flex items-center justify-between px-6 md:px-8 md:ml-72">

      {/* IZQUIERDA */}
      <div className="flex items-center gap-3">
        {/* BOTÓN HAMBURGUESA */}
        <button
          className="md:hidden"
          onClick={onMenuClick}
        >
          <span className="material-icons text-primario">menu</span>
        </button>

        <h1 className="font-bold text-2xl">{title}</h1>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-4">

        {/* NOTIFICACIONES */}
        <button className="relative hover:text-primario transition">
          <span className="material-icons">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* CONFIG */}
        <button className="hover:text-primario transition hover:rotate-90 duration-300">
          <span className="material-icons">settings</span>
        </button>

        {/* USUARIO */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-black/5 px-2 py-1 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/assets/react.svg" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                Sergio
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => console.log("Cerrar sesión")}
            >
              <span className="material-icons text-sm mr-2">
                logout
              </span>
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
