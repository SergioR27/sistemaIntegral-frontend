import {
  useLocation,
  useNavigate
} from "react-router-dom";
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
import {
  clearAuthSession,
  getStoredUser
} from "@/utils/auth";

const routeTitles: Record<string, string> = {
  "/areas": "Áreas",
  "/dashboard": "Dashboard",
  "/sic/oficios": "SIC / Oficios",
  "/sic/registros": "SIC / Registros",
  "/inventario/catalogo": "Inventario / Catálogos",
  "/inventario/equipos": "Inventario / Equipos",
  "/tickets/servicio": "Tickets / Servicio",
  "/personal": "Personal",
  "/organigrama": "Organigrama",
};

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const usuario = getStoredUser();

  const title =
    routeTitles[pathname] ?? "Sistema Integral";

  const nombreCompleto = usuario
    ? `${usuario.nombre} ${usuario.apellidos}`.trim()
    : "Usuario";

  const iniciales = usuario
    ? `${usuario.nombre?.[0] ?? ""}${usuario.apellidos?.[0] ?? ""}`.toUpperCase()
    : "SI";

  const handleLogout = () => {
    clearAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <header className="h-14 bg-grisClaro flex items-center justify-between px-6 md:px-8 md:ml-72 dark:bg-oscuro-fondo">
      <div className="flex items-center gap-3 h-full">
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

      <div className="flex items-center gap-2 sm:gap-4 h-full">
        <button className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-black/5 transition hover:text-primario dark:hover:text-gray-400">
          <span className="material-icons leading-none">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 transition hover:rotate-90 duration-300 hidden sm:flex hover:text-primario dark:hover:text-gray-400">
          <span className="material-icons leading-none">
            settings
          </span>
        </button>

        <div className="h-9 flex items-center">
          <ThemeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-black/5 transition">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/assets/react.svg" />
                <AvatarFallback>{iniciales}</AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium hidden sm:block leading-none">
                {nombreCompleto}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer flex items-center"
              onClick={handleLogout}
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
