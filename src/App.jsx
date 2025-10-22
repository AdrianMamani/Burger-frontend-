import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/home/home";
import Terminos from "./pages/home/terminos";
import Politica from "./pages/home/politica";
import Login from "./pages/login/login";

// Rutas de administrador
import Dashboard from "./pages/admin/dashboard/pages/dashboard";
import CategoriaAdmin from "./pages/admin/categorias/pages/categoria";
import ProductoAdmin from "./pages/admin/productos/pages/producto";
import Profile from "./pages/admin/perfil/pages/Profile";
import Cupon from "./pages/admin/cupon/pages/cupon";
import PoliticaAdmin from "./pages/admin/politica/pages/PoliticaAdmin";
import TerminosAdmin from "./pages/admin/terminos/pages/TerminosAdmin";

function App() {
  const [cart, setCart] = useState([]); // carrito global

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

  return (
    <Router>
      <Routes>
        {/*Redirige automáticamente de "/" a "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Sitio público */}
        <Route
          path="/home"
          element={<Home addToCart={addToCart} cart={cart} setCart={setCart} />}
        />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/politicas" element={<Politica />} />
        <Route path="/login" element={<Login />} />

        {/* Panel administrador */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/categorias" element={<CategoriaAdmin />} />
        <Route path="/admin/categorias/:id_categoria" element={<ProductoAdmin />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/cupon" element={<Cupon />} />
        <Route path="/admin/politicas" element={<PoliticaAdmin />} />
        <Route path="/admin/terminos" element={<TerminosAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
