import React, { useEffect, useState } from "react";
import { FaBox, FaTags, FaTicketAlt, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CountUp from "./js/CountUp";

const StatCard = () => {
  const [stats, setStats] = useState({
    productos: 0,
    categorias: 0,
    cupones: 0,
  });
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");

  // 🕒 Actualizar hora en tiempo real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📦 Obtener datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, categoriasRes, cuponesRes] = await Promise.all([
          fetch("https://apiricoton.cartavirtual.shop/api/producto"),
          fetch("https://apiricoton.cartavirtual.shop/api/categorias"),
          fetch("https://apiricoton.cartavirtual.shop/api/cupon"),
        ]);

        const productosData = await productosRes.json();
        const categoriasData = await categoriasRes.json();
        const cuponesData = await cuponesRes.json();

        setStats({
          productos: Array.isArray(productosData) ? productosData.length : 0,
          categorias: Array.isArray(categoriasData) ? categoriasData.length : 0,
          cupones: Array.isArray(cuponesData) ? cuponesData.length : 0,
        });

        setCategorias(
          Array.isArray(categoriasData)
            ? categoriasData.filter((c) => c.estado === 1)
            : []
        );
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  // 💡 Tarjetas
  const cards = [
    {
      title: "Productos",
      value: stats.productos,
      icon: <FaBox size={45} />,
      iconColor: "bg-gray-800",
      isProductCard: true, // solo esta tarjeta tendrá selector
    },
    {
      title: "Categorías",
      value: stats.categorias,
      icon: <FaTags size={45} />,
      iconColor: "bg-blue-500",
      route: "/admin/categorias",
    },
    {
      title: "Cupones",
      value: stats.cupones,
      icon: <FaTicketAlt size={45} />,
      iconColor: "bg-green-500",
      route: "/admin/cupon",
    },
    {
      title: "Hora actual",
      value: currentTime,
      icon: <FaClock size={45} />,
      iconColor: "bg-pink-600",
    },
  ];

  // Función para redirigir al seleccionar una categoría
  const handleCategoryChange = (e) => {
    const id = e.target.value;
    if (id) {
      navigate(`/admin/categorias/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, index) => (
        <div
          key={index}
          className="relative bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[115px]"
        >
          {/* Parte superior: Icono + texto */}
          <div className="flex items-center">
            <div
              className={`w-1/4 flex items-center justify-center p-3 rounded-lg text-white ${stat.iconColor} shadow-md`}
            >
              {stat.icon}
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-sm font-medium text-gray-500">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {typeof stat.value === "number" ? (
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    direction="up"
                    duration={1.2}
                    className="count-up-text"
                  />
                ) : (
                  stat.value
                )}
              </span>
            </div>
          </div>

          {/* Si es tarjeta de productos, mostrar selector */}
          {stat.isProductCard ? (
            <select
              onChange={handleCategoryChange}
              className={`absolute bottom-5 right-3 px-1 py-1.5 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-200 ${stat.iconColor} hover:opacity-90 bg-gray-800`}
              defaultValue=""
            >
              <option value="" disabled>
                Ver categoria
              </option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          ) : (
            stat.route && (
              <button
                onClick={() => navigate(stat.route)}
                className={`absolute bottom-5 right-3 px-3 py-1.5 text-sm font-semibold text-white rounded-lg shadow-md transition-all duration-200 ${stat.iconColor} hover:opacity-90`}
              >
                Ver más →
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default StatCard;
