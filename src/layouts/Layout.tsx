import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Layout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 bg-grisClaro md:ml-72 px-3 sm:px-4 lg:px-6 pt-2 sm:pt-3 dark:bg-oscuro-fondo">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}
