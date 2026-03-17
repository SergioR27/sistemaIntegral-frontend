import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import Layout from "../layouts/Layout";
import Login from "@/pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Personal from "../pages/Personal";
import Oficios from "@/pages/sic/Oficios";
import Registros from "@/pages/sic/Registros";
import Equipos from "@/pages/inventario/Equipos";
import Organigrama from "@/pages/Organigrama";
import Asignacion from "@/pages/inventario/Asignacion";
import Areas from "@/pages/Areas";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* DASHBOARD */}
        <Route element={<Layout />}>
          <Route path="/areas" element={<Areas />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organigrama" element={<Organigrama />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/sic">
            <Route path="oficios" element={<Oficios />} />
            <Route path="registros" element={<Registros />} />
          </Route>
          <Route path="/inventario">
            <Route path="equipos" element={<Equipos />} />
            <Route path="asignacion" element={<Asignacion />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
