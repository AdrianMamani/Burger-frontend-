import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/AdminSidebar";
import HeaderAdmin from "../../../../components/shared/AdminHeader";
import ProductoTable from "../components/ProductoTable";
import NewProducto from "../components/NewProducto";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("Bembos");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // 🔄 recargar tabla al crear/editar
  const [categoriaNombre, setCategoriaNombre] = useState("");


  const { id_categoria } = useParams(); // obtiene la categoría actual desde la URL

  useEffect(() => {
  const fetchCategoriaNombre = async () => {
    try {
      const res = await fetch("https://apiricoton.cartavirtual.shop/api/categorias");
      const data = await res.json();

      const categoria = data.find(
        (c) => c.id_categoria == id_categoria
      );

      if (categoria) setCategoriaNombre(categoria.nombre);
    } catch (error) {
      console.error("Error al obtener categoría:", error);
    }
  };

  fetchCategoriaNombre();
}, [id_categoria]);

  // 🟦 Obtener nombre de la empresa
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

  // 🟦 Cambiar título del navegador
  useEffect(() => {
    document.title = `${empresaNombre} - Administrador/Productos`;
  }, [empresaNombre]);

  // 🟦 Colocar favicon
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/menu.png";
  }, []);

  // 🟩 Recargar tabla al guardar o editar
  const handleSaveProduct = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-grow flex flex-col">
        <HeaderAdmin />

        <main className="flex-grow p-8 overflow-y-auto relative">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {categoriaNombre || "Productos"}
            </h1>

            {/* 🔍 Barra de búsqueda + botón */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-8">
              <div className="w-full sm:w-[85%]">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="w-full sm:w-[15%]">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition w-full"
                >
                  + Nuevo producto
                </button>
              </div>
            </div>

            {/* 🗂 Tabla de productos */}
            <ProductoTable
              search={searchTerm}
              refreshTrigger={refreshKey}
              categoryId={id_categoria}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
            />
          </div>

          {/* Modal lateral */}
          <NewProducto
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  initialData={editingProduct}
  categoryId={id_categoria}
  onSuccess={handleSaveProduct}  // 🚀 ESTA ES LA CLAVE
/>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
