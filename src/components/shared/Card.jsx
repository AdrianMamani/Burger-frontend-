import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

const Card = ({ darkMode, products, addToCart, selectedCategory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [error, setError] = useState(null);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  // Obtener datos de la categoría seleccionada
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
            return cat.nombre.toLowerCase() === selectedCategory.toLowerCase();
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
    <div className="w-full mt-6 md:mt-8">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Banner de categoría (solo móvil) */}
      {categoryInfo && (
        <div className="block md:hidden w-full mb-4 px-3">
          <div
            className={`flex items-center p-4 w-full rounded-2xl transition-all duration-300
              text-white shadow-lg`}
            style={{
              background: `linear-gradient(135deg, ${
                categoryInfo.dominantColor || "#F0320C"
              } 0%, ${
                categoryInfo.dominantColor
                  ? categoryInfo.dominantColor + "aa"
                  : "#ff5a36"
              } 100%)`,
            }}
          >
            <div className="w-1/3 pr-3">
              <img
                src={`https://apiricoton.cartavirtual.shop/${categoryInfo.imagen_url}`}
                alt={categoryInfo.nombre}
                className="w-full h-auto object-contain rounded-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=Sin+Imagen")
                }
              />
            </div>
            <div className="w-2/3 pl-2">
              <h4 className="font-extrabold text-lg">{categoryInfo.nombre}</h4>
              {categoryInfo.descripcion && (
                <p className="text-xs mt-1">{categoryInfo.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 justify-items-center px-2 sm:px-3">
        {categoryInfo && (
          <div className="hidden md:block w-full">
            <div
              className={`flex flex-col justify-between p-3 h-full rounded-xl border transition-all duration-300
                min-h-[320px] text-white shadow-md`}
              style={{
                background: `linear-gradient(135deg, ${
                  categoryInfo.dominantColor || "#F0320C"
                } 0%, ${
                  categoryInfo.dominantColor
                    ? categoryInfo.dominantColor + "aa"
                    : "#ff5a36"
                } 100%)`,
              }}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={`https://apiricoton.cartavirtual.shop/${categoryInfo.imagen_url}`}
                  alt={categoryInfo.nombre}
                  className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150?text=Sin+Imagen")
                  }
                />
              </div>
              <div className="flex flex-col text-center w-full mt-3 flex-grow">
                <h4 className="font-extrabold text-xl md:text-2xl">
                  {categoryInfo.nombre}
                </h4>
                {categoryInfo.descripcion && (
                  <p className="text-sm md:text-base mt-1">
                    {categoryInfo.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tarjetas de productos */}
        {products.map((product) => (
          <div
            key={product.id_producto}
            className={`flex flex-col justify-between p-3 w-full rounded-xl border transition-all duration-300 cursor-pointer
              ${
                darkMode
                  ? "bg-[#262837] border-gray-700 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            onClick={() => openModal(product)}
          >
            <img
              src={`https://apiricoton.cartavirtual.shop/${product.imagen_url}`}
              alt={product.nombre}
              className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg mx-auto"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/150?text=Sin+Imagen")
              }
            />
            <div className="flex flex-col text-left w-full mt-3 flex-grow">
              <h4 className="font-semibold text-base md:text-lg">
                {product.nombre}
              </h4>
              <p className="text-sm mt-1">Precio: S/ {product.precio}</p>
            </div>

            <button
              className="mt-3 w-full py-2 rounded-lg font-medium flex items-center justify-center bg-[#F0320C] hover:bg-[#d42c0b] text-white"
              onClick={(e) => {
                e.stopPropagation(); // evita abrir modal al hacer click en añadir
                addToCart(product);
              }}
            >
              <FaShoppingCart size={18} className="mr-2" />
              Añadir
            </button>
          </div>
        ))}
      </div>

      {/* Modal detalle producto */}
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
              <h2 className="text-lg font-semibold mx-auto">Detalle del producto</h2>
              <button
                onClick={closeModal}
                className="absolute left-4 top-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-full w-9 h-9 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pt-6 px-6 pb-2">
              <div className="flex justify-center mb-6">
                <img
                  src={`https://apiricoton.cartavirtual.shop/${selectedProduct.imagen_url}`}
                  alt={selectedProduct.nombre}
                  className="w-56 h-56 sm:w-60 sm:h-60 object-cover rounded-xl"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/250?text=Sin+Imagen")
                  }
                />
              </div>

              <hr
                className={`w-full mx-auto mb-4 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              />

              <div className="text-left flex flex-col pt-2">
                <h4 className="text-xl font-bold mb-2">{selectedProduct.nombre}</h4>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Precio:</span> S/ {selectedProduct.precio}
                </p>
                <p
                  className={`text-base mb-6 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  <span className="font-semibold">Descripción:</span> {selectedProduct.descripcion}
                </p>
              </div>
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
