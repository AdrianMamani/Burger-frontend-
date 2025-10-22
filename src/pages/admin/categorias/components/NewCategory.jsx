import React from "react";
import CategoryForm from "./CategoryForm";

const RightModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo borroso */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Contenedor lateral derecho */}
      <div className="relative ml-auto w-1/4 h-full bg-white shadow-2xl p-6 animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        <CategoryForm
          initialData={initialData}
          onCancel={onClose}
          onSuccess={(data) => {
            if (onSubmit) onSubmit(data); // Llama a onCreate o onEdit desde el padre
            onClose(); // Cierra el modal automáticamente
          }}
        />
      </div>
    </div>
  );
};

export default RightModal;
