import React, { useEffect, useState, useRef } from "react";
import { RiSearch2Line } from "react-icons/ri";

const Header = ({
  darkMode,
  selectedCategory,
  onSelectCategory,
  onSearch,
  showOrder,
}) => {
  const [categories, setCategories] = useState([]);
  const [empresa, setEmpresa] = useState({
    nombre: "",
  });

  const categoryRef = useRef(null);
  const [showDots, setShowDots] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEmpresa({
            nombre: data.nombre || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching empresa:", err));
  }, []);

  useEffect(() => {
    const container = categoryRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      setScrollPosition(maxScroll > 0 ? container.scrollLeft / maxScroll : 0);
    };

    const checkScroll = () => {
      setShowDots(container.scrollWidth > container.clientWidth);
    };

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  return (
    <header>
      {/* Nombre centrado en móvil */}
      {!showOrder && (
        <div
          className={`md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center
          ${darkMode ? "text-gray-300" : "text-white"}
          rounded-b-full py-3 w-[95%] transition-colors duration-300 ease-in-out`}
          style={{
            background: scrolled
              ? "linear-gradient(90deg, #fd5d00ff, #e90404ff)"
              : darkMode
              ? "#1F1D2B"
              : "linear-gradient(90deg, #fd5d00ff, #e90404ff)",
          }}
        >
          <h1
            className="text-center uppercase special-gothic-expanded-one-regular"
            style={{ fontSize: "28px" }}
          >
            {empresa.nombre}
          </h1>
        </div>
      )}

      <div className="md:hidden h-16" />

      {/* Bienvenida + buscador */}
      <div
        className={`flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 
        md:bg-transparent md:rounded-none 
        ${darkMode ? "text-gray-300" : "text-black"}`}
      >
        {/* SOLO PC: mensaje de bienvenida */}
        <div className="pt-2 hidden md:block">
          <h1
            className={`uppercase martian-mono ${
              darkMode ? "text-gray-300" : "text-black"
            }`}
            style={{
              fontSize: "32px",
              lineHeight: "32px",
            }}
          >
            Bienvenidos a {empresa.nombre}
          </h1>
        </div>

        {/* Buscador */}
        <form className="px-2 md:px-0">
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
                  ? "bg-[#2B2A3A] text-gray-300"
                  : "bg-white text-black border border-gray-200"
              }`}
              placeholder="Buscar producto..."
            />
          </div>
        </form>
      </div>

      {/* Categorías */}
      <nav
        ref={categoryRef}
        className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap items-center gap-4 border-b pb-2 scrollbar-hide touch-pan-x"
      >
        <button
          onClick={() => onSelectCategory("Todos")}
          className={`relative py-2 px-5 rounded-full transition-all duration-300 flex-shrink-0 ${
            selectedCategory === "Todos"
              ? "bg-[#F0580C] text-white"
              : "bg-transparent text-gray-700 hover:bg-gray-100"
          }`}
        >
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id_categoria}
            onClick={() => onSelectCategory(cat.id_categoria)}
            className={`relative py-2 px-5 rounded-full transition-all duration-300 flex-shrink-0 ${
              selectedCategory === cat.id_categoria
                ? "bg-[#F0580C] text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </nav>

      {/* Dots del scroll */}
      {showDots && (
        <div className="flex justify-center mt-2 mb-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.round(scrollPosition * 2) === i
                  ? "bg-red-600"
                  : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
