import React, { useState, useEffect } from "react";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

const Card = ({ darkMode, products, addToCart, selectedCategory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [error, setError] = useState(null);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  // ✅ Obtener datos de la categoría seleccionada
  useEffect(() => {
    const fetchCategory = async () => {
      if (!selectedCategory || selectedCategory === "Todos") {
        setCategoryInfo(null);
        return;
      }

      try {
        const response = await fetch(
          "https://apiricoton.cartavirtual.shop/api/categorias"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const allCategories = await response.json();

        const found = allCategories.find((cat) => {
          if (typeof selectedCategory === "number") {
            return cat.id_categoria === selectedCategory;
          }
          if (typeof selectedCategory === "string") {
            return (
              cat.nombre.toLowerCase() === selectedCategory.toLowerCase()
            );
          }
          return false;
        });

        if (!found) {
          throw new Error(
            `No se encontró la categoría con valor "${selectedCategory}"`
          );
        }

        setCategoryInfo(found);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching category:", err);
        setError(`Error al obtener la categoría: ${err.message}`);
        setCategoryInfo(null);
      }
    };

    fetchCategory();
  }, [selectedCategory]);

  return (
    <div className="w-full">
      {/* ⚠️ Mostrar error si ocurre */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center font-semibold">
          {error}
        </div>
      )}

      {/* 🟧 Banner dinámico moderno con color automático */}
{categoryInfo && (
  <div className="relative w-full mt-8 mb-10 flex items-center justify-center overflow-visible rounded-3xl px-4 sm:px-6 lg:px-10">
    {/* Fondo del banner */}
    <div
      className="relative w-full rounded-3xl flex flex-col lg:flex-row items-center justify-between shadow-xl transition-all duration-500 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${categoryInfo.dominantColor || "#F0320C"} 0%, ${
          categoryInfo.dominantColor ? categoryInfo.dominantColor + "aa" : "#ff5a36"
        } 100%)`,
      }}
    >
      {/* 🧾 Contenido textual */}
      <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left p-6 sm:p-10 z-20">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white uppercase drop-shadow-lg tracking-wide mb-2">
          {categoryInfo.nombre}
        </h2>

        {/* Descripción solo visible en pantallas grandes */}
        {categoryInfo.descripcion && (
          <p className="hidden lg:block text-lg text-white/90 leading-snug max-w-xl drop-shadow-md">
            {categoryInfo.descripcion}
          </p>
        )}
      </div>

      {/* 💡 Imagen moderna flotante (solo en pantallas grandes) */}
      <div className="hidden lg:flex relative justify-center items-center w-[260px] h-[260px] mr-10 z-30">
        <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl scale-150"></div>

        <img
          src={`https://apiricoton.cartavirtual.shop/${categoryInfo.imagen_url}`}
          alt={categoryInfo.nombre}
          className="object-contain w-[230px] h-[230px] drop-shadow-xl transform translate-y-[-10px] hover:translate-y-[-15px] transition-all duration-500"
          onLoad={async (e) => {
            const img = e.target;
            try {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
                .data;

              let r = 0,
                g = 0,
                b = 0,
                count = 0;
              for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
              }
              r = Math.floor(r / count);
              g = Math.floor(g / count);
              b = Math.floor(b / count);
              const avgColor = `rgb(${r}, ${g}, ${b})`;

              setCategoryInfo((prev) => ({
                ...prev,
                dominantColor: avgColor,
              }));
            } catch (err) {
              console.error("Error detectando color dominante:", err);
            }
          }}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/230x230?text=Sin+Imagen")
          }
        />
      </div>
    </div>
  </div>
)}


      {/* ✅ Cards de productos */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center px-3 sm:px-4 md:px-6">
        {products.map((product) => (
          <div
            key={product.id_producto}
            className={`flex flex-col justify-between p-4 w-full rounded-2xl border transition-all duration-300
              ${
                darkMode
                  ? "bg-[#262837] border-gray-700 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              } 
              sm:max-w-[340px] sm:min-h-[360px] 
              md:max-w-[400px] md:min-h-[420px] 
              xl:max-w-[280px] xl:min-h-[320px]
            `}
          >
            <img
              src={`https://apiricoton.cartavirtual.shop/${product.imagen_url}`}
              alt={product.nombre}
              className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-xl mx-auto"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/150?text=Sin+Imagen")
              }
            />

            <div className="flex flex-col text-left w-full mt-3 flex-grow">
              <h4 className="font-semibold text-lg md:text-xl">
                {product.nombre}
              </h4>
              <p className="text-sm md:text-base mt-1">
                Precio: S/ {product.precio}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className={`w-1/2 py-2 rounded-lg font-medium flex items-center justify-center ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
                onClick={() => openModal(product)}
              >
                <FaEye size={18} />
              </button>
              <button
                className="w-1/2 py-2 rounded-lg font-medium flex items-center justify-center bg-[#F0320C] hover:bg-[#d42c0b] text-white"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧭 Modal detalle producto */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeModal}
          ></div>

          <div
            className={`fixed right-0 top-0 h-full z-50 overflow-y-auto flex flex-col justify-between ${
              darkMode ? "bg-[#1F1D2B] text-gray-300" : "bg-white text-gray-900"
            } w-full max-w-[420px]`}
          >
            <div
              className={`flex items-center justify-between px-5 py-4 border-b relative ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={closeModal}
                className="absolute left-4 top-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-full w-9 h-9 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <RiCloseLine size={22} />
              </button>

              <h2 className="text-lg font-semibold mx-auto">
                Detalle del producto
              </h2>
            </div>

            <div className="p-6 text-left flex flex-col">
              <img
                src={`https://apiricoton.cartavirtual.shop/${selectedProduct.imagen_url}`}
                alt={selectedProduct.nombre}
                className="w-48 h-48 object-cover rounded-xl mb-4 self-center"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/200?text=Sin+Imagen")
                }
              />

              <h4 className="text-xl font-semibold mb-2">
                {selectedProduct.nombre}
              </h4>

              <p className="text-md mb-2 font-medium">
                <span className="font-semibold">Precio:</span> S/{" "}
                {selectedProduct.precio}
              </p>

              <p className="text-sm mb-6">
                <span className="font-semibold">Descripción:</span>{" "}
                {selectedProduct.descripcion}
              </p>
            </div>

            <div
              className={`p-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                className="w-full py-3 rounded-lg font-medium bg-[#F0320C] hover:bg-[#d42c0b] text-white"
                onClick={() => {
                  addToCart(selectedProduct);
                  closeModal();
                }}
              >
                Añadir
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
