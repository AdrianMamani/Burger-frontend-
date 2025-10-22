import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import CuponTable from "../components/CuponTable";
import NewCupon from "../components/NewCupon";

const CuponPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCupon, setEditingCupon] = useState(null); // Para editar
  const [empresaNombre, setEmpresaNombre] = useState("Bembos"); // valor por defecto
    
  // --- Traer nombre de la empresa ---
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("https://apiricoton.cartavirtual.shop/api/empresa");
        const data = await res.json();
        if (data && data.nombre) setEmpresaNombre(data.nombre);
      } catch (error) {
        console.error("Error al obtener el nombre de la empresa:", error);
      }
    };
    fetchEmpresa();
  }, []);

  // --- Actualizar título de la pestaña ---
  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Cupones`;
  }, [empresaNombre]);

  // --- Poner favicon de la imagen admin.png ---
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/menu.png"; // ruta relativa a public
  }, []);

  const handleCreateCupon = (data) => {
    console.log("Nuevo cupón agregado:", data);
    // Aquí llamarías a tu API
  };

  const handleEditCupon = (data) => {
    console.log("Cupón editado:", data);
    // Aquí llamarías a tu API
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-grow flex flex-col">
        <HeaderAdmin />
        <main className="flex-grow p-8 overflow-y-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Cupones</h1>
            <button
              onClick={() => {
                setEditingCupon(null); // Creamos nuevo cupón
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              + Crear Cupón
            </button>
          </div>

          <CuponTable
            onEdit={(cupon) => {
              setEditingCupon(cupon);
              setIsModalOpen(true);
            }}
          />

          {/* Modal lateral */}
          <NewCupon
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={editingCupon}
            onSubmit={editingCupon ? handleEditCupon : handleCreateCupon}
          />
        </main>
      </div>
    </div>
  );
};

export default CuponPage;
