import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiApps2Line,
  RiUser3Line,
  RiShareLine,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import { FaTicket } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  // --- Traer categorías desde la API ---
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("https://apiricoton.cartavirtual.shop/api/categorias");
        const data = await res.json();
        setCategorias(data.filter((c) => c.estado === 1)); // solo activas
      } catch (error) {
        console.error("Error al traer categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const sections = [
    {
      title: "Administrador",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
        { name: "Perfil", path: "/admin/profile", icon: <RiUser3Line /> },
        { name: "Cupon", path: "/admin/cupon", icon: <FaTicket /> },
        {
          name: "Categorías",
          path: "/admin/categorias",
          icon: <RiApps2Line />,
          subItems: categorias.map((cat) => ({
            name: cat.nombre,
            path: `/admin/categorias/${cat.id_categoria}`,
          })),
        },
      ],
    },
    {
      title: "Web",
      items: [
        { name: "Términos y Condiciones", path: "/admin/terminos", icon: <RiShareLine /> },
        { name: "Políticas de Privacidad", path: "/admin/politicas", icon: <BsShieldCheck /> },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#1F1D2B] text-white flex flex-col shadow-xl">
      {/* Encabezado con imagen */}
      <div className="p-6 flex flex-col items-center justify-center border-b border-gray-700">
        <div className="w-48 h-36 overflow-hidden shadow-lg flex items-center justify-center rounded-xl">
          <img
            src="/logo_administrador.png" // logo
            alt="Logo Admin"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* NAV PRINCIPAL */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold tracking-wider">
              {section.title}
            </h3>

            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-[#ec7c6a] text-white"
                        : "text-gray-300 hover:bg-[#ec7c6a] hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>

                  {item.subItems && item.subItems.length > 0 && (
                    <ul
                      className={`ml-10 mt-2 space-y-1 pr-2 ${
                        item.subItems.length > 7 ? "max-h-48 overflow-y-auto custom-scroll" : ""
                      }`}
                    >
                      {item.subItems.map((sub, j) => (
                        <li key={j}>
                          <Link
                            to={sub.path}
                            className={`block px-3 py-1 rounded-md text-sm transition-colors ${
                              location.pathname === sub.path
                                ? "bg-[#ec7c6a] text-white"
                                : "text-gray-400 hover:bg-[#ec7c6a] hover:text-white"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <RiLogoutCircleRLine className="text-xl" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>

      {/* Estilos para ocultar scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
};

export default SidebarAdmin;
