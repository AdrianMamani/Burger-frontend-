import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import CuponTable from "../components/CuponTable";
import NewCupon from "../components/NewCupon";

const CuponPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCupon, setEditingCupon] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("Bembos");
  const [cupones, setCupones] = useState([]);

  // --- Traer nombre de empresa ---
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

  // --- Cargar cupones ---
  const fetchCupones = async () => {
    try {
      const res = await fetch("https://apiricoton.cartavirtual.shop/api/cupon");
      const data = await res.json();
      setCupones(data);
    } catch (error) {
      console.error("Error al cargar cupones:", error);
    }
  };

  useEffect(() => {
    fetchCupones();
  }, []);

  // --- Cambiar título del documento ---
  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Cupones`;
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

  // --- Crear nuevo cupón ---
  const handleCreateCupon = (nuevoCupon) => {
    // ✅ Se muestra al instante en la tabla
    setCupones((prev) => [nuevoCupon, ...prev]);

    // Cierra el modal
    setIsModalOpen(false);

    // 🔁 Espera 2 segundos y recarga toda la página
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  // --- Editar cupón ---
  const handleEditCupon = (cuponEditado) => {
    // ✅ Actualiza al instante
    setCupones((prev) =>
      prev.map((c) =>
        c.id_cupon === cuponEditado.id_cupon ? cuponEditado : c
      )
    );

    // Cierra el modal
    setIsModalOpen(false);

    // 🔁 Espera 2 segundos y recarga toda la página
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
                setEditingCupon(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              + Crear Cupón
            </button>
          </div>

          {/* 🔹 Tabla de cupones */}
          <CuponTable
            cupones={cupones}
            onEdit={(cupon) => {
              setEditingCupon(cupon);
              setIsModalOpen(true);
            }}
          />

          {/* 🔹 Modal */}
          <NewCupon
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={editingCupon}
            onSuccess={(nuevoCupon, isEditMode) => {
              if (isEditMode) handleEditCupon(nuevoCupon);
              else handleCreateCupon(nuevoCupon);
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default CuponPage;
