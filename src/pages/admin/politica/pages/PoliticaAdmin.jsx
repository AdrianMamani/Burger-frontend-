import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import PoliticaComponent from "../components/PoliticaComponents";

const PoliticaAdmin = () => {
  const [empresaNombre, setEmpresaNombre] = useState("Mi Empresa");

  // --- Obtener nombre de la empresa ---
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("https://apiricoton.cartavirtual.shop/api/empresa");
        const data = await res.json();
        if (data && data.nombre) setEmpresaNombre(data.nombre);
      } catch (error) {
        console.error("Error al obtener nombre de empresa:", error);
      }
    };
    fetchEmpresa();
  }, []);

  // --- Título de pestaña ---
  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Políticas`;
  }, [empresaNombre]);

  // --- Favicon ---
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/menu.png";
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      {/* Contenido */}
      <div className="flex-grow flex flex-col">
        <HeaderAdmin />
        <main className="flex-grow p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion de Políticas</h1>
          <PoliticaComponent />
        </main>
      </div>
    </div>
  );
};

export default PoliticaAdmin;
