import React, { useState, useEffect } from "react";
import swal from "sweetalert";

const ProductoForm = ({ initialData = null, categoryId, onCancel, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
    previewUrl: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        imageFile: null,
        previewUrl: initialData.imageUrl || null,
      });
    } else {
      setFormData({ name: "", description: "", price: "", imageFile: null, previewUrl: null });
    }
  }, [initialData]);

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
    setLoading(true);

    try {
      const form = new FormData();
      form.append("nombre", formData.name);
      form.append("descripcion", formData.description);
      form.append("precio", formData.price);
      form.append("estado", 1);

      // --- Enviamos id_categoria ---
      if (categoryId) form.append("id_categoria", categoryId);

      if (formData.imageFile) form.append("imagen", formData.imageFile);

      let url = "https://apiricoton.cartavirtual.shop/api/producto";
      let method = "POST";

      if (isEditMode) {
        url = `${url}/${initialData.id_producto}`;
        form.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method,
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

      swal("Éxito", isEditMode ? "Producto actualizado correctamente" : "Producto creado correctamente", "success");

      if (!isEditMode) setFormData({ name: "", description: "", price: "", imageFile: null, previewUrl: null });
      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error(error);
      swal("Error de conexión", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
      </div>

      <div className="border-t pt-4 mt-4 flex justify-end space-x-3 bg-white sticky bottom-0">
        <button
          type="button"
          onClick={onCancel}
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
          {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;
