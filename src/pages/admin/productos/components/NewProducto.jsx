// ProductModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import swal from "sweetalert";

const ProductModal = ({ isOpen, onClose, categoryId, onSuccess }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
    previewUrl: null,
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Bloquear scroll sin romper el body
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = original || "auto";
      };
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      swal("Error", "No se ha seleccionado categoría", "error");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("nombre", formData.name);
      form.append("descripcion", formData.description);
      form.append("precio", formData.price);
      form.append("estado", 1);
      form.append("id_categoria", categoryId);
      if (formData.imageFile) form.append("imagen", formData.imageFile);

      const response = await fetch(
        "https://apiricoton.cartavirtual.shop/api/producto",
        {
          method: "POST",
          body: form,
          headers: { Accept: "application/json" },
        }
      );

      const text = await response.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {
        swal("Error", "El servidor no devolvió JSON válido.", "error");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        swal("Error", data.message || "Error al registrar el producto", "error");
        setLoading(false);
        return;
      }

      swal("Éxito", "Producto creado correctamente", "success");

      setFormData({
        name: "",
        description: "",
        price: "",
        imageFile: null,
        previewUrl: null,
      });

      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      swal("Error de conexión", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative ml-auto w-full sm:w-2/5 h-full bg-white shadow-2xl p-6 animate-slideIn flex flex-col">

        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo Producto</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
            title="Cerrar"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto space-y-4 pb-32"
        >
          <label className="block">
            <span className="text-gray-700">Nombre</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Descripción</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
              rows={5}
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Precio</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
              step="0.01"
              required
            />
          </label>

          <div>
            <span className="text-gray-700">Imagen</span>

            <label
              htmlFor="imageFile"
              className="block mt-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-blue-700 w-fit"
            >
              Seleccionar archivo
            </label>

            <input
              id="imageFile"
              type="file"
              name="imageFile"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />

            {formData.previewUrl && (
              <img
                src={formData.previewUrl}
                className="mt-4 w-full h-[260px] object-contain rounded-xl border shadow-sm bg-white"
                alt="Preview"
              />
            )}
          </div>

          <input type="hidden" name="id_categoria" value={categoryId} />
        </form>

        <div className="absolute bottom-0 left-0 w-full bg-white border-t p-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
