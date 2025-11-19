// 🔥 CÓDIGO COMPLETO DE Card.jsx CON DESCUENTO EN addToCart

import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { RiCoupon2Line } from "react-icons/ri";
import { TbDiscount2 } from "react-icons/tb";

const Card = ({ darkMode, products, addToCart, selectedCategory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [error, setError] = useState(null);
  const [cupones, setCupones] = useState([]);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    const fetchCupones = async () => {
      try {
        const res = await fetch("https://apiricoton.cartavirtual.shop/api/cupon");
        const data = await res.json();
        setCupones(data);
      } catch (err) {
        console.error("❌ Error al obtener cupones:", err);
      }
    };
    fetchCupones();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!selectedCategory || selectedCategory === "Todos") {
        setCategoryInfo(null);
        return;
      }

      try {
        const response = await fetch("https://apiricoton.cartavirtual.shop/api/categorias");
        const allCategories = await response.json();

        const found = allCategories.find((cat) => {
          if (typeof selectedCategory === "number")
            return cat.id_categoria === selectedCategory;
          if (typeof selectedCategory === "string")
            return cat.nombre.toLowerCase() === selectedCategory.toLowerCase();
        });

        if (!found) throw new Error("Categoría no encontrada");
        setCategoryInfo(found);
      } catch (err) {
        setError(`Error al obtener la categoría: ${err.message}`);
        setCategoryInfo(null);
      }
    };

    fetchCategory();
  }, [selectedCategory]);

  const obtenerDescuento = (product) => {
    const hoy = new Date();
    return (
      cupones.find(
        (c) =>
          c.estado === true &&
          new Date(c.fecha_inicio) <= hoy &&
          new Date(c.fecha_fin) >= hoy &&
          (c.id_producto === product.id_producto ||
            c.id_categoria === product.id_categoria)
      ) || null
    );
  };

  const calcularPrecioConDescuento = (precio, cup) => {
    if (!cup) return precio;
    if (cup.tipo === "porcentaje")
      return (precio - precio * (cup.valor / 100)).toFixed(2);
    return (precio - cup.valor).toFixed(2);
  };

  return (
    <div className="w-full mt-6 md:mt-8">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3 text-center font-semibold">
          {error}
        </div>
      )}

      {/* BANNER MÓVIL */}
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

      {/* GRID */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 px-2 sm:px-3">
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

        {/* TARJETAS */}
        {products.map((product) => {
          const cup = obtenerDescuento(product);
          const nuevoPrecio = calcularPrecioConDescuento(product.precio, cup);

          return (
            <div
              key={product.id_producto}
              className={`relative flex flex-col justify-between p-3 w-full rounded-xl border cursor-pointer transition-all ${
                darkMode
                  ? "bg-[#262837] border-gray-700 text-gray-300"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
              onClick={() => openModal(product)}
            >
              {cup && (
                <div className="absolute top-2 right-2 z-20">
                  <div className="bg-white backdrop-blur-sm p-0.5 rounded-full">
                    <TbDiscount2 size={32} className="text-red-600" />
                  </div>
                </div>
              )}

              <img
                src={`https://apiricoton.cartavirtual.shop/${product.imagen_url}`}
                alt={product.nombre}
                className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-lg mx-auto"
              />

              <div className="flex flex-col mt-3 flex-grow text-left">
                <h4 className="font-semibold text-base md:text-lg">
                  {product.nombre}
                </h4>

                {cup ? (
                  <div className="mt-1">
                    <p className="text-xs line-through opacity-70">
                      S/ {product.precio}
                    </p>

                    <div className="flex items-center gap-1">
                      <p className="text-red-500 font-bold">S/ {nuevoPrecio}</p>
                      <span className="text-[10px] text-red-600 font-semibold">
                        ({cup.tipo === "porcentaje"
                          ? `${cup.valor}%`
                          : `-S/ ${cup.valor}`})
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm mt-1">Precio: S/ {product.precio}</p>
                )}
              </div>

              {/* 🔥 BOTÓN CORREGIDO */}
              <button
                className="mt-3 w-full py-2 rounded-lg flex justify-center items-center bg-[#F0320C] hover:bg-[#d42c0b] text-white"
                onClick={(e) => {
                  e.stopPropagation();

                  const cup = obtenerDescuento(product);

                  let descuento = 0;
                  if (cup) {
                    descuento =
                      cup.tipo === "porcentaje"
                        ? product.precio * (cup.valor / 100)
                        : parseFloat(cup.valor);
                  }

                  addToCart({
                    ...product,
                    descuento,
                    cupon: cup || null,
                    precioFinal: product.precio - descuento,
                  });
                }}
              >
                <FaShoppingCart size={18} className="mr-2" /> Añadir
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeModal}
          ></div>

          <div
            className={`fixed right-0 top-0 h-full z-50 overflow-y-auto flex flex-col justify-between ${
              darkMode
                ? "bg-[#1F1D2B] text-gray-300"
                : "bg-white text-gray-900"
            } w-full max-w-[420px]`}
          >
            <div className="flex items-center px-5 py-4 lg:hidden">
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 z-[999] bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg md:hidden"
              >
                <IoIosArrowBack size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center px-6">
              <img
                src={`https://apiricoton.cartavirtual.shop/${selectedProduct.imagen_url}`}
                className="w-80 h-80 rounded-2xl mt-4"
              />

              <div className="w-full mt-5">
                <h4 className="text-2xl font-bold">{selectedProduct.nombre}</h4>

                {(() => {
                  const cup = obtenerDescuento(selectedProduct);
                  const nuevoPrecio = calcularPrecioConDescuento(
                    selectedProduct.precio,
                    cup
                  );

                  return cup ? (
                    <div className="mt-4">
                      <p className="line-through text-gray-400 text-sm">
                        S/ {selectedProduct.precio}
                      </p>

                      <div className="flex items-center gap-2">
                        <p className="text-red-600 font-bold text-2xl">
                          S/ {nuevoPrecio}
                        </p>
                        <span className="text-sm text-red-500 font-semibold">
                          ({cup.tipo === "porcentaje"
                            ? `${cup.valor}%`
                            : `-S/ ${cup.valor}`})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold mt-4">
                      S/ {selectedProduct.precio}
                    </p>
                  );
                })()}

                <p className="text-base mt-4 mb-6">
                  {selectedProduct.descripcion}
                </p>
              </div>
            </div>

            {/* 🔥 BOTÓN CORREGIDO DEL MODAL */}
            <div className="p-5 flex gap-4">
              <button
                className="w-full py-3 rounded-2xl font-medium bg-black text-white"
                onClick={() => {
                  const cup = obtenerDescuento(selectedProduct);

                  let descuento = 0;
                  if (cup) {
                    descuento =
                      cup.tipo === "porcentaje"
                        ? selectedProduct.precio * (cup.valor / 100)
                        : parseFloat(cup.valor);
                  }

                  addToCart({
                    ...selectedProduct,
                    descuento,
                    cupon: cup || null,
                    precioFinal: selectedProduct.precio - descuento,
                  });

                  closeModal();
                }}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
