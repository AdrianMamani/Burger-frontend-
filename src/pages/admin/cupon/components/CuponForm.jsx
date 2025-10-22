import React, { useState, useEffect } from "react";
import swal from "sweetalert";

const CuponForm = ({ initialData = null, onCancel, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    codigo: "",
    tipo: "porcentaje",
    valor: "",
    id_categoria: "",
    id_producto: "",
    fecha_inicio: "",
    fecha_fin: "",
    cantidad_total: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo || "",
        tipo: initialData.tipo || "porcentaje",
        valor: initialData.valor || "",
        id_categoria: initialData.id_categoria || "",
        id_producto: initialData.id_producto || "",
        fecha_inicio: initialData.fecha_inicio
          ? initialData.fecha_inicio.split("T")[0]
          : "",
        fecha_fin: initialData.fecha_fin ? initialData.fecha_fin.split("T")[0] : "",
        cantidad_total: initialData.cantidad_total || "",
      });
    }
  }, [initialData]);

  // Cargar categorías y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProd] = await Promise.all([
          fetch("https://apiricoton.cartavirtual.shop/api/categorias"),
          fetch("https://apiricoton.cartavirtual.shop/api/producto"),
        ]);

        const catData = await resCat.json();
        const prodData = await resProd.json();

        setCategorias(catData || []);
        setProductos(prodData || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        swal("Error", "No se pudieron cargar categorías o productos", "error");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cambiar tipo (porcentaje/monto)
  const toggleTipo = () => {
    setFormData({
      ...formData,
      tipo: formData.tipo === "porcentaje" ? "monto" : "porcentaje",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        codigo: formData.codigo,
        tipo: formData.tipo,
        valor: formData.valor,
        id_categoria: formData.id_categoria || null,
        id_producto: formData.id_producto || null,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        estado: true,
        cantidad_total: formData.cantidad_total,
      };

      const urlBase = "https://apiricoton.cartavirtual.shop/api/cupon";
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `${urlBase}/${initialData.id_cupon}` : urlBase;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        swal("Error", data.message || "Error al guardar el cupón", "error");
        return;
      }

      swal(
        "Éxito",
        isEditMode ? "Cupón actualizado correctamente" : "Cupón creado correctamente",
        "success"
      );

      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      swal("Error", "No se pudo conectar con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* Código */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Código</span>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
        </label>

        {/* Tipo (palanca) */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-700 font-semibold">
            Tipo: {formData.tipo === "porcentaje" ? "Porcentaje" : "Monto"}
          </span>
          <button
            type="button"
            onClick={toggleTipo}
            className={`relative inline-flex items-center h-6 rounded-full w-14 transition-colors ${
              formData.tipo === "porcentaje" ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            <span
              className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ${
                formData.tipo === "porcentaje" ? "translate-x-0" : "translate-x-8"
              }`}
            />
          </button>
        </div>

        {/* Valor */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Valor</span>
          <input
            type="number"
            step="0.01"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
        </label>

        {/* Categoría */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Categoría (opcional)</span>
          <select
            name="id_categoria"
            value={formData.id_categoria || ""}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          >
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </label>

        {/* Producto */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Producto (opcional)</span>
          <select
            name="id_producto"
            value={formData.id_producto || ""}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          >
            <option value="">Sin producto</option>
            {productos.map((prod) => (
              <option key={prod.id_producto} value={prod.id_producto}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </label>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700 font-semibold">Fecha inicio</span>
            <input
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-semibold">Fecha fin</span>
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-2"
              required
            />
          </label>
        </div>

        {/* Cantidad total */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Cantidad total</span>
          <input
            type="number"
            name="cantidad_total"
            value={formData.cantidad_total}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
        </label>
      </div>

      {/* Botones */}
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

export default CuponForm;
