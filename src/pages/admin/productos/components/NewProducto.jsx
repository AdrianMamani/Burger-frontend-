// ProductModal.jsx
import React, { useState, useEffect } from "react";
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

  const [categoryName, setCategoryName] = useState(""); // Nombre de la categoría
  const [loading, setLoading] = useState(false);

  // --- Traer nombre de la categoría desde la API ---
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      try {
        const res = await fetch(`https://apiricoton.cartavirtual.shop/api/categoria/${categoryId}`);
        const data = await res.json();
        setCategoryName(data.nombre || `Categoría ${categoryId}`);
      } catch (err) {
        console.error(err);
        setCategoryName(`Categoría ${categoryId}`);
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, imageFile: file, previewUrl: URL.createObjectURL(file) });
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

      const response = await fetch("https://apiricoton.cartavirtual.shop/api/producto", {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        swal("Error", "El servidor no devolvió JSON.", "error");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        swal("Error", data.message || "Ocurrió un error al guardar el producto", "error");
        setLoading(false);
        return;
      }

      swal("Éxito", "Producto creado correctamente", "success");
      setFormData({ name: "", description: "", price: "", imageFile: null, previewUrl: null });
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (error) {
      console.error(error);
      swal("Error de conexión", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      ></div>

      <div className="relative w-1/3 h-screen bg-white shadow-2xl p-6 animate-slideIn overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo Producto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="space-y-4">
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
                className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                rows={2}
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

            <label className="block">
              <span className="text-gray-700">Imagen</span>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 w-full"
              />
              {formData.previewUrl && (
                <img
                  src={formData.previewUrl}
                  alt="Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </label>

            {/* Mostrar nombre de la categoría */}
            <label className="block">
              <span className="text-gray-700">Categoría</span>
              <input
                type="text"
                value={categoryName || categoryId}
                readOnly
                className="mt-1 w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              />
            </label>

            <input type="hidden" name="id_categoria" value={categoryId} />
          </div>

          <div className="border-t pt-4 mt-4 flex justify-end space-x-3 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .animate-slideIn { animation: slideIn 0.3s forwards; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fadeIn { animation: fadeIn 0.3s forwards; }
        `}
      </style>
    </div>
  );
};

export default ProductModal;
