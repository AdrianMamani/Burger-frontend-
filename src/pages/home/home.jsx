/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBook } from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";
import { FaCartPlus, FaTicket } from "react-icons/fa6";
import Sidebar from "../../components/shared/Sidebar";
import Car from "../../components/shared/Car1";
import Header from "../../components/shared/Header";
import Card from "../../components/shared/Card";
import DiscountToast from "../../components/cupon_web";
import { motion, AnimatePresence } from "framer-motion";
import { RiTimeLine } from "react-icons/ri";


// 🔹 Ítem del Navbar
const NavItem = ({ icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center cursor-pointer p-1.5 relative"
    style={{ transform: "translateY(-4px)" }}
  >
    <Icon
      className="transition-all duration-300 text-white"
      size={24} 
    />
    {active && (
      <div className="absolute top-[30px] w-6 h-[3px] bg-white rounded-full" />
    )}
  </button>
);

// 🔹 Navbar Curvo Inferior (tamaño reducido)
const CurvedBottomNavbar = ({
  navigate,
  setShowOrder,
  cartCount,
  activeRoute,
}) => {
  const navItems = [
    { icon: FaHome, label: "Inicio", route: "/home" },
    { icon: MdPrivacyTip, label: "Perfil", route: "/perfil" },
    { icon: FaTicket, label: "Promociones", route: "/promociones" },
    { icon: FaBook, label: "Favoritos", route: "/favoritos" },
  ];

  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  const handleNavClick = (route) => {
    if (route) navigate(route);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-50">
      <div className="relative h-16">
        {/* SVG del navbar curvo */}
        <svg
          viewBox="0 0 375 90"
          className="absolute bottom-0 w-full h-full text-[#F0320C]"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0 25C0 10 10 0 25 0H120C135 0 145 10 160 25C185 55 190 55 215 25C230 10 240 0 255 0H350C365 0 375 10 375 25V90H0V25Z" />
        </svg>

        {/* 🔸 Botón central flotante */}
        <button
          onClick={() => setShowOrder(true)}
          className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#F0320C] rounded-full flex items-center justify-center cursor-pointer"
          style={{
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <FaCartPlus className="w-7 h-7 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#F0320C] text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {cartCount}
            </span>
          )}
        </button>

        {/* 🔸 Ítems del Navbar */}
        <div className="flex justify-between items-center h-full pt-3 px-2">
          <div className="flex w-1/2 justify-evenly">
            {leftItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                active={activeRoute === item.route}
                onClick={() => handleNavClick(item.route)}
              />
            ))}
          </div>

          <div className="w-14 h-14" />

          <div className="flex w-1/2 justify-evenly">
            {rightItems.map((item, index) => (
              <NavItem
                key={index + 2}
                icon={item.icon}
                active={activeRoute === item.route}
                onClick={() => handleNavClick(item.route)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Página principal Home
const Home = ({ addToCart, cart, setCart }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [bannerUrl, setBannerUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [horario, setHorario] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const videoRef = useRef(null);

  const [activeRoute, setActiveRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setActiveRoute(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const slides = [];
  if (bannerUrl) slides.push({ type: "image", src: bannerUrl });
  if (videoUrl && videoUrl.includes("youtube"))
    slides.push({ type: "video", src: videoUrl });

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/producto")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/recursos-empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.portada_url)
            setBannerUrl(
              `https://apiricoton.cartavirtual.shop/${data.portada_url}`
            );
          if (data.logo_url)
            setLogoUrl(`https://apiricoton.cartavirtual.shop/${data.logo_url}`);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("https://apiricoton.cartavirtual.shop/api/empresa")
      .then((res) => res.json())
      .then((data) => {
        setEmpresa(data);
        if (data.nombre) setEmpresaNombre(data.nombre);
        if (data.horario) setHorario(data.horario);
        if (data.video_pres_url) setVideoUrl(data.video_pres_url);
        if (data.facebook_url) setFacebookUrl(data.facebook_url);
        if (data.tiktok_url) setTiktokUrl(data.tiktok_url);
        if (data.instagram_url) setInstagramUrl(data.instagram_url);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (empresaNombre) document.title = `${empresaNombre} / Home`;
    if (logoUrl) {
      const favicon =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      favicon.rel = "icon";
      favicon.href = logoUrl;
      document.head.appendChild(favicon);
    }
  }, [empresaNombre, logoUrl]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((p) =>
    searchTerm.trim() !== ""
      ? p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : selectedCategory === "Todos"
      ? true
      : p.id_categoria === selectedCategory
  );

  if (showSplash) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="w-48 h-auto object-contain" />
        )}
      </div>
    );
  }

  return (
    <>
      <DiscountToast />
      <div
        className={`w-full min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-[#262837] text-gray-300" : "bg-gray-100 text-gray-900"
        }`}
      >
        <Sidebar showMenu={showMenu} darkMode={darkMode} empresa={empresa} />
        <Car
          showOrder={showOrder}
          setShowOrder={setShowOrder}
          darkMode={darkMode}
          cart={cart}
          setCart={setCart}
        />

        {!showOrder && (
          <CurvedBottomNavbar
            navigate={navigate}
            setShowOrder={setShowOrder}
            cartCount={cart.length}
            activeRoute={activeRoute}
          />
        )}

        <main className="lg:pl-32 lg:pr-96 pb-20">
          <div className="md:p-8 p-4">
            {!showOrder && (
              <Header
                darkMode={darkMode}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSearch={setSearchTerm}
              />
            )}

            {selectedCategory === "Todos" &&
              searchTerm.trim() === "" &&
              slides.length > 0 && (
                <div className="relative w-full mb-6 mt-4">
                  <AnimatePresence mode="wait">
                    {slides[currentIndex].type === "image" ? (
                      <motion.img
                        key="banner"
                        src={slides[currentIndex].src}
                        alt="Banner"
                        className="w-full rounded-lg shadow-md mx-auto object-cover h-48 sm:h-64 md:h-80 lg:h-[450px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <motion.iframe
                        key="video"
                        ref={videoRef}
                        className="rounded-lg shadow-md w-full h-48 sm:h-64 md:h-80 lg:h-[450px]"
                        src={`${slides[
                          currentIndex
                        ].src.replace("watch?v=", "embed/")}?enablejsapi=1`}
                        title="Presentación"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      ></motion.iframe>
                    )}
                  </AnimatePresence>
                    {/* Contenedor bajo banner */}
                    <div
                      className="absolute left-30px right-0 mx-auto rounded-2xl shadow-lg 
                                flex flex-col items-center justify-center 
                                px-6 py-4 gap-1"
                      style={{
                        backgroundColor: "#ffffff",
                        bottom: "-50px",
                        width: "fit-content",
                        maxWidth: "90%",
                      }}
                    >
                      {/* Horario visible en todas las pantallas */}
                      <div className="flex flex-col text-black justify-center items-center">
                        <div className="flex items-center gap-2 text-base md:text-lg font-semibold justify-center">
                          <RiTimeLine className="text-xl md:text-2xl text-[#F0320C]" />
                          <span>Hora de atención</span>
                        </div>

                        <span className="text-sm md:text-base font-medium text-center">
                          {horario || "Lunes a Domingo: 10:00 a.m. - 11:00 p.m."}
                        </span>
                      </div>
                    </div>
                </div>
              )}

            <Card
              darkMode={darkMode}
              products={filteredProducts}
              addToCart={addToCart}
              selectedCategory={selectedCategory}
            />
          </div>
        </main>
        {/* FOOTER2 */}
          <footer className="py-6 text-center text-sm mt-10">
            <p>
              © {new Date().getFullYear()}{" "}
              {empresa ? empresa.nombre : "Cargando..."}. Todos los derechos
              reservados.
            </p>
            {empresa && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-xs max-w-xl mx-auto">
                {empresa.ubicacion}
              </p>
            )}
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="/terminos"
                className="hover:text-amber-500 transition-colors"
              >
                Términos de Servicio
              </a>
              <span>•</span>
              <a href="/politicas" className="text-amber-500 font-medium">
                Política de Privacidad
              </a>
            </div>
          </footer>
      </div>
    </>
  );
};

export default Home;
