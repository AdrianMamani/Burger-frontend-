import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/home/home";
import Terminos from "./pages/home/terminos";
import Politica from "./pages/home/politica";
import Login from "./pages/login/login";

// Panel administrador
import Dashboard from "./pages/admin/dashboard/pages/dashboard";
import CategoriaAdmin from "./pages/admin/categorias/pages/categoria";
import ProductoAdmin from "./pages/admin/productos/pages/producto";
import Profile from "./pages/admin/perfil/pages/Profile";
import Cupon from "./pages/admin/cupon/pages/cupon";
import PoliticaAdmin from "./pages/admin/politica/pages/PoliticaAdmin";
import TerminosAdmin from "./pages/admin/terminos/pages/TerminosAdmin";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [cart, setCart] = useState([]); // carrito global
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id_producto === product.id_producto);
      if (exist) {
        return prev.map((item) =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  // Componente para bloquear acceso desde móviles
  const OnlyDesktop = ({ children }) => {
    if (!isDesktop) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            background: "#000",
            color: "#fff",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <h2>Acceso no disponible</h2>
          <p>Este módulo no esta disponible para celulares.</p>
        </div>
      );
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Redirige "/" a "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Sitio público */}
        <Route
          path="/home"
          element={<Home addToCart={addToCart} cart={cart} setCart={setCart} />}
        />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/politicas" element={<Politica />} />

        {/* Login restringido solo a PC/Laptop */}
        <Route
          path="/login"
          element={
            <OnlyDesktop>
              <Login />
            </OnlyDesktop>
          }
        />

        {/* Panel administrador protegido y solo accesible desde PC/Laptop */}
        <Route
          path="/admin/dashboard"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <CategoriaAdmin />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
        <Route
          path="/admin/categorias/:id_categoria"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <ProductoAdmin />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
        <Route
          path="/admin/cupon"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <Cupon />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
        <Route
          path="/admin/politicas"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <PoliticaAdmin />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
        <Route
          path="/admin/terminos"
          element={
            <OnlyDesktop>
              <PrivateRoute>
                <TerminosAdmin />
              </PrivateRoute>
            </OnlyDesktop>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
