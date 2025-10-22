import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaShoppingCart } from "react-icons/fa";

const Card = ({ darkMode, products, addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <div className="w-full">
      <h3
        className={`text-2xl font-semibold mb-6 text-center ${
          darkMode ? "text-gray-300" : "text-gray-900"
        }`}
      >
        Nuestros Platos
      </h3>

      {/* ✅ SIN tarjeta global blanca */}
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
            />

            <div className="flex flex-col text-left w-full mt-3 flex-grow">
              <h4 className="font-semibold text-lg md:text-xl">{product.nombre}</h4>
              <p className="text-sm md:text-base mt-1">
                Precio: S/ {product.precio}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="w-1/2 py-2 rounded-lg font-medium flex items-center justify-center"
                style={{
                  backgroundColor: darkMode ? "#343a40" : "#e5e7eb",
                  color: darkMode ? "#fff" : "#111",
                }}
                onClick={() => openModal(product)}
              >
                <FaEye size={18} />
              </button>
              <button
                className="w-1/2 py-2 rounded-lg font-medium flex items-center justify-center"
                style={{ backgroundColor: "#F0320C", color: "#fff" }}
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧭 MODAL lateral */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={closeModal}
            />

            <motion.div
              className={`fixed right-0 top-0 h-full z-50 overflow-y-auto flex flex-col justify-between ${
                darkMode ? "bg-[#1F1D2B] text-gray-300" : "bg-white text-gray-900"
              }`}
              style={{
                width: "100%",
                maxWidth: "420px",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            >
              <div
                className={`flex items-center justify-between px-5 py-4 border-b relative ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {/* 🔽 Botón de cierre mejor posicionado */}
                <button
                  onClick={closeModal}
                  className="absolute left-4 top-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                >
                  ×
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
                  className="w-full py-3 rounded-lg font-medium"
                  style={{ backgroundColor: "#F0320C", color: "#fff" }}
                  onClick={() => {
                    addToCart(selectedProduct);
                    closeModal();
                  }}
                >
                  Añadir
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Card;
