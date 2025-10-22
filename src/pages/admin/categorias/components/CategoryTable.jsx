import React, { useState, useEffect, useMemo } from "react";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import CategoryForm from "./CategoryForm";
import swal from "sweetalert";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const API_URL = "https://apiricoton.cartavirtual.shop/api/categorias";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
      setFilteredCategories(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() === "") {
        setFilteredCategories(categories);
      } else {
        const filtered = categories.filter(c =>
          c.nombre.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, categories]);

  const handleEdit = (category) => {
    setSelectedCategory({
      id_categoria: category.id_categoria,
      name: category.nombre,
      description: category.descripcion,
      imageUrl: `https://apiricoton.cartavirtual.shop/${category.imagen_url}`,
    });
  };

  const handleDelete = async (id) => {
    const confirm = await swal({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    });
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        swal("Eliminado!", "La categoría fue eliminada.", "success");
        fetchCategories();
      } else {
        swal("Error", "No se pudo eliminar la categoría.", "error");
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      swal("Error", "Error de conexión al eliminar.", "error");
    }
  };

  const handleSave = () => {
    fetchCategories();
    setSelectedCategory(null);
  };

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  return (
    <div className="relative bg-white p-6 rounded-2xl">
      {/* Controles: búsqueda y tamaño de página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-semibold">Mostrar:</label>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-500">Cargando categorías...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((category) => (
                <tr
                  key={category.id_categoria}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.id_categoria}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{category.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.descripcion}</td>
                  <td className="px-6 py-4">
                    <img
                      src={`https://apiricoton.cartavirtual.shop/${category.imagen_url}`}
                      alt={category.nombre}
                      className="h-16 w-auto object-cover border rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                        title="Editar"
                      >
                        <RiEditLine />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id_categoria)}
                        className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                        title="Eliminar"
                      >
                        <RiDeleteBin6Line />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Panel lateral de edición */}
      <AnimatePresence>
        {selectedCategory && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-1/4 bg-white shadow-2xl z-50 p-6 overflow-y-auto rounded-l-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">Editar Categoría</h3>
              <CategoryForm
                initialData={selectedCategory}
                onCancel={() => setSelectedCategory(null)}
                onSuccess={handleSave}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Paginación */}
      <div className="flex justify-end mt-4 gap-2 items-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={currentPage === 1}
        >
          <HiArrowLeft /> Anterior
        </button>
        <span className="px-3 py-1 border rounded-lg bg-gray-50 text-gray-700">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Siguiente <HiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CategoryTable;
