import React, { useEffect, useState } from "react";
import {
  RiSearch2Line,
  RiPhoneLine,
  RiMapPin2Line,
} from "react-icons/ri";

const Header = ({ darkMode, selectedCategory, onSelectCategory, onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [empresa, setEmpresa] = useState({ telefono: "", ubicacion: "" });

  // 🔹 Traer categorías
  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 🔹 Traer datos de empresa (teléfono y ubicación)
  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEmpresa({
            telefono: data.telefono || "",
            ubicacion: data.ubicacion || "",
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
      {/* 🔸 Bloque superior con título, fecha y buscador */}
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

      {/* 🔹 Información de contacto (alineada a la izquierda, uno debajo del otro) */}
      <div
        className={`flex flex-col items-start text-sm mb-4 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <RiPhoneLine className="text-lg text-red-600" />
          <span>
            <strong>Teléfono:</strong>{" "}
            {empresa.telefono || "No disponible"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <RiMapPin2Line className="text-lg text-red-600" />
          <span>
            <strong>Ubicación:</strong>{" "}
            {empresa.ubicacion || "No registrada"}
          </span>
        </div>
      </div>

      {/* 🔹 Menú de categorías */}
      <nav
        className={`flex flex-wrap items-center justify-start gap-4 border-b pb-2 ${
          darkMode ? "text-gray-300" : "text-black"
        }`}
      >
        <button
          onClick={() => onSelectCategory("Todos")}
          className={`relative py-2 px-4 ${
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
            className={`relative py-2 px-4 ${
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
