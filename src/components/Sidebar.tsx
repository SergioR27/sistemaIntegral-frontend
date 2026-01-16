import { NavLink } from "react-router-dom";

const linkBase = `
  relative
  flex items-center justify-between
  w-full
  px-7 py-4 mb-2
  transition-all duration-300
  rounded-l-full
`;

const linkActive = "bg-grisClaro text-primario shadow-xl";
const linkInactive = "text-grisClaro hover:bg-grisClaro/10";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen w-75
        bg-gradient-to-b from-primario to-primario-dark
        text-white rounded-r-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* LOGO */}
      <div className="h-24 flex items-center justify-between px-10 border-b border-grisClaro/20">
        <span className="text-2xl font-bold tracking-wide text-grisClaro">
          Sistema Integral
        </span>

        {/* BOTÓN CERRAR MOBILE */}
        <button className="md:hidden" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
      </div>

      <nav className="mt-6 pl-3 space-y-6">
        <SidebarLink to="/dashboard" icon="dashboard" label="Dashboard" />

        <Section title="SIC">
          <SidebarLink to="/sic/oficios" icon="description" label="Oficios" />
          <SidebarLink to="/sic/registros" icon="folder" label="Registros" />
        </Section>

        <Section title="Inventario">
          <SidebarLink to="/inventario/equipos" icon="devices" label="Equipos" />
        </Section>

        <Section title="Personal">
          <SidebarLink to="/personal" icon="groups" label="Personal" />
        </Section>

      </nav>
    </aside>
  );
}

/* ---------- COMPONENTES AUX ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-6 mb-2 text-xs uppercase tracking-widest text-grisClaro/60">
        {title}
      </p>
      {children}
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      <div className="flex items-center gap-3">
        <span className="material-icons text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>

      <span className="material-icons text-sm opacity-70">
        chevron_right
      </span>
    </NavLink>
  );
}
