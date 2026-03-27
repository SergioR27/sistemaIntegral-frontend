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
import ThemeToggle from "./ThemeToggle";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sic/oficios": "SIC / Oficios",
  "/sic/registros": "SIC / Registros",
  "/inventario/catalogo": "Inventario / Catálogos",
  "/inventario/equipos": "Inventario / Equipos",
  "/inventario/asignacion": "Inventario / Asignación",
  "/personal": "Personal",
  "/organigrama": "Organigrama",
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
    <header className="h-14 bg-grisClaro flex items-center justify-between px-6 md:px-8 md:ml-72 dark:bg-oscuro-fondo">

      {/* IZQUIERDA */}
      <div className="flex items-center gap-3 h-full">
        {/* BOTÓN HAMBURGUESA */}
        <button
          onClick={onMenuClick}
          className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-black/5"
        >
          <span className="material-icons text-primario leading-none">
            menu
          </span>
        </button>

        <h1 className="font-bold text-2xl leading-none">
          {title}
        </h1>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-2 sm:gap-4 h-full">

        {/* NOTIFICACIONES */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-black/5 transition hover:text-primario dark:hover:text-gray-400">
          <span className="material-icons leading-none">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* CONFIG */}
        <button className="h-9 w-9  items-center justify-center rounded-md hover:bg-black/5 transition hover:rotate-90 duration-300 hidden sm:flex hover:text-primario dark:hover:text-gray-400">
          <span className="material-icons leading-none">
            settings
          </span>
        </button>

        {/* DARK MODE */}
        <div className="h-9 flex items-center">
          <ThemeToggle />
        </div>

        {/* USUARIO */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-black/5 transition">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/assets/react.svg" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium hidden sm:block leading-none">
                Sergio
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer flex items-center"
              onClick={() => console.log("Cerrar sesión")}
            >
              <span className="material-icons text-sm mr-2 leading-none">
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
