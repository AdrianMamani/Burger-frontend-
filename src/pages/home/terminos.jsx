import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome6Line } from "react-icons/ri";
import { FaBook } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import Sidebar from "../../components/shared/Sidebar";

const Terminos = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [data, setData] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/recursos-empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logo_url) {
          const url = `https://apiricoton.cartavirtual.shop/${data.logo_url}`;
          setLogoUrl(url);

          const favicon =
            document.querySelector("link[rel='icon']") ||
            document.createElement("link");
          favicon.rel = "icon";
          favicon.href = url;
          document.head.appendChild(favicon);
        }
      })
      .catch((err) => console.error("Error obteniendo logo:", err));
  }, []);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/terminos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los términos");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los términos y condiciones.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((empresaData) => {
        setEmpresa(empresaData);
        document.title = `${empresaData.nombre} / Términos y Condiciones`;
      })
      .catch((err) => console.error("Error cargando empresa:", err));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (logoUrl && empresa) {
      const timer = setTimeout(() => setShowSplash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [logoUrl, empresa]);

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo empresa" className="w-44 h-auto" />
        ) : (
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#ec7c6a] rounded-full animate-spin" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#262837] text-white" : "bg-gray-100 text-[#111]"
      }`}
    >
      <Sidebar showMenu={showMenu} darkMode={darkMode} />

      <div
        className={`lg:px-32 pb-24 lg:pb-10 ${
          darkMode ? "text-white" : "text-[#111]"
        }`}
      >
        <div className="p-4 md:p-8">
          <nav
            className={`lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2
    flex items-center justify-between w-[88%] h-16 z-30
    rounded-3xl shadow-xl backdrop-blur-md border
    ${darkMode ? "bg-[#1F1D2B]/90 border-gray-700" : "bg-white/90 border-gray-300"}
  `}
          >
            <button
              onClick={() => navigate("/home")}
              aria-label="Inicio"
              className={`flex items-center justify-center flex-1 h-full transition-all group rounded-none
    ${location.pathname === "/home"
                  ? "bg-[#F0320C] text-white rounded-l-3xl"
                  : "hover:bg-[#F0320C] hover:text-white hover:rounded-l-3xl"
                }
  `}
            >
              <RiHome6Line
                className={`text-2xl transition-colors ${
                  location.pathname === "/home" ? "text-white" : (darkMode ? "text-gray-300" : "text-gray-700")
                } group-hover:text-white`}
              />
            </button>

            <button
              onClick={() => navigate("/terminos")}
              aria-label="Términos"
              className={`flex items-center justify-center flex-1 h-full transition-all group rounded-none
    ${location.pathname === "/terminos"
                  ? "bg-[#F0320C] text-white"
                  : "hover:bg-[#F0320C] hover:text-white"
                }
  `}
            >
              <FaBook
                className={`text-2xl transition-colors ${
                  location.pathname === "/terminos" ? "text-white" : (darkMode ? "text-gray-300" : "text-gray-700")
                } group-hover:text-white`}
              />
            </button>

            <button
              onClick={() => navigate("/politicas")}
              aria-label="Privacidad"
              className={`flex items-center justify-center flex-1 h-full transition-all group rounded-none
    ${location.pathname === "/politicas"
                  ? "bg-[#F0320C] text-white rounded-r-3xl"
                  : "hover:bg-[#F0320C] hover:text-white hover:rounded-r-3xl"
                }
  `}
            >
              <BsShieldCheck
                className={`text-2xl transition-colors ${
                  location.pathname === "/politicas" ? "text-white" : (darkMode ? "text-gray-300" : "text-gray-700")
                } group-hover:text-white`}
              />
            </button>
          </nav>


          <div className="mt-4 md:mt-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-1 text-[#ec7c6a]">
                  {data ? data.titulo : "Términos y Condiciones"}
                </h1>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl ${
                darkMode
                  ? "bg-[#1F1D2B] border border-gray-700"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {loading && (
                <p className="text-center text-gray-500">
                  Cargando términos...
                </p>
              )}
              {error && (
                <p className="text-center text-red-500 font-semibold">{error}</p>
              )}
              {!loading && !error && data && (
                <div
                  className="text-[15.5px] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.descripcion
                      .replace(/\n/g, "<br />")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              )}
            </div>
          </div>

          <footer className="py-6 text-center text-sm mt-10">
            <p>
              © {new Date().getFullYear()}{" "}
              {empresa ? empresa.nombre : "Cargando..."}.
              Todos los derechos reservados.
            </p>
            {empresa && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-xs max-w-xl mx-auto">
                {empresa.ubicacion}
              </p>
            )}
            <div className="flex justify-center gap-4 mt-2">
              <a href="/terminos" className="text-amber-500 font-medium">
                Términos de Servicio
              </a>
              <span>•</span>
              <a
                href="/politicas"
                className="hover:text-amber-500 transition-colors"
              >
                Política de Privacidad
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Terminos;