import React, { useEffect, useState, useRef } from "react";
import {
  RiSearch2Line,
  RiPhoneLine,
  RiMapPin2Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Header = ({ darkMode, selectedCategory, onSelectCategory, onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [empresa, setEmpresa] = useState({
    telefono: "",
    ubicacion: "",
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
  });
  const [showInfo, setShowInfo] = useState(false);
  const categoryRef = useRef(null);

  // 🔹 Traer categorías
  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 🔹 Traer datos de empresa
  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEmpresa({
            telefono: data.telefono || "",
            ubicacion: data.ubicacion || "",
            facebook_url: data.facebook_url || "",
            instagram_url: data.instagram_url || "",
            tiktok_url: data.tiktok_url || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching empresa:", err));
  }, []);

  // 🔹 Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDateTime.toLocaleDateString("es-ES", options);
  const formattedTime = currentDateTime.toLocaleTimeString("es-ES");

  return (
    <header>
      {/* 🔸 Encabezado superior */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div>
          <h1
            className={`${
              darkMode ? "text-gray-300" : "text-black"
            } text-2xl font-semibold`}
          >
            Nuestro Menú
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {formattedDate} - {formattedTime}
          </p>
        </div>

        <form>
          <div className="w-full md:w-96 lg:w-[400px] relative">
            <RiSearch2Line
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full py-2 pl-10 pr-4 rounded-lg outline-none ${
                darkMode
                  ? "bg-[#1F1D2B] text-gray-300"
                  : "bg-white text-black border border-gray-200"
              }`}
              placeholder="Buscar producto..."
            />
          </div>
        </form>
      </div>

      {/* 🔹 Botón para ver info */}
      <div className="mb-4 flex justify-start">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`flex items-center gap-2 text-sm font-medium transition ${
            darkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`}
        >
          {showInfo ? (
            <RiArrowUpSLine className="text-lg text-red-600" />
          ) : (
            <RiArrowDownSLine className="text-lg text-red-600" />
          )}
          {showInfo ? "Ocultar información" : "Ver información"}
        </button>
      </div>

      {/* 🔹 Información desplegable */}
      {showInfo && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 transition-all duration-300 ease-in-out ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div className="flex flex-col items-start text-sm">
            <div className="flex items-center gap-2 mb-1">
              <RiPhoneLine className="text-lg text-red-600 flex-shrink-0" />
              <span>
                <strong>Teléfono:</strong> {empresa.telefono || "No disponible"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <RiMapPin2Line className="text-lg text-red-600 flex-shrink-0" />
              <span>
                <strong>Ubicación:</strong> {empresa.ubicacion || "No registrada"}
              </span>
            </div>
          </div>

          {/* 🔹 Redes sociales centradas en pantallas pequeñas */}
          <div className="flex justify-center gap-6 mt-3 sm:hidden w-full">
            {empresa.facebook_url && (
              <a
                href={empresa.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-xl transition"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
            )}
            {empresa.instagram_url && (
              <a
                href={empresa.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-xl transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            )}
            {empresa.tiktok_url && (
              <a
                href={empresa.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-xl transition"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Menú de categorías deslizable táctil */}
      <nav
        ref={categoryRef}
        className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap items-center gap-4 border-b pb-2 scrollbar-hide touch-pan-x"
      >
        <button
          onClick={() => onSelectCategory("Todos")}
          className={`relative py-2 px-4 flex-shrink-0 ${
            selectedCategory === "Todos"
              ? "text-[#ec7c6a] before:w-1/2 before:h-[2px] before:absolute before:bg-[#ec7c6a] before:left-0 before:rounded-full before:-bottom-[1px]"
              : ""
          }`}
        >
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id_categoria}
            onClick={() => onSelectCategory(cat.id_categoria)}
            className={`relative py-2 px-4 flex-shrink-0 ${
              selectedCategory === cat.id_categoria
                ? "text-[#ec7c6a] before:w-1/2 before:h-[2px] before:absolute before:bg-[#ec7c6a] before:left-0 before:rounded-full before:-bottom-[1px]"
                : ""
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
