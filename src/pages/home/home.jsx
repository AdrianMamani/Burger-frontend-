import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiHome6Line,
  RiTimeLine,
  RiShoppingCart2Line,
} from "react-icons/ri";
import { FaBook, FaFacebookF, FaTiktok, FaInstagram } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Sidebar from "../../components/shared/Sidebar";
import Car from "../../components/shared/Car1";
import Header from "../../components/shared/Header";
import Card from "../../components/shared/Card";
import { motion, AnimatePresence } from "framer-motion";

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
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const videoRef = useRef(null);

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
            setBannerUrl(`https://apiricoton.cartavirtual.shop/${data.portada_url}`);
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

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  if (showSplash) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {logoUrl && <img src={logoUrl} alt="Logo" className="w-48 h-auto object-contain" />}
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#262837] text-gray-300" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar showMenu={showMenu} darkMode={darkMode} />
      <Car
        showOrder={showOrder}
        setShowOrder={setShowOrder}
        darkMode={darkMode}
        cart={cart}
        setCart={setCart}
      />

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
          className={`flex items-center justify-center flex-1 h-full transition-all group
    rounded-none
    ${location.pathname === "/home"
              ? "bg-[#F0320C] text-white rounded-l-3xl"
              : "hover:bg-[#F0320C] hover:text-white hover:rounded-l-3xl active:bg-[#F0320C] active:rounded-l-3xl focus:bg-[#F0320C] focus:rounded-l-3xl"
            }
    `}
        >
          <RiHome6Line className="text-2xl" />
        </button>

        <button
          onClick={() => navigate("/terminos")}
          aria-label="Términos"
          className={`flex items-center justify-center flex-1 h-full transition-all group
    rounded-none
    ${location.pathname === "/terminos"
              ? "bg-[#F0320C] text-white"
              : "hover:bg-[#F0320C] hover:text-white active:bg-[#F0320C] focus:bg-[#F0320C]"
            }
    `}
        >
          <FaBook className="text-2xl" />
        </button>

        <button
          onClick={() => navigate("/politicas")}
          aria-label="Privacidad"
          className={`flex items-center justify-center flex-1 h-full transition-all group
    rounded-none
    ${location.pathname === "/politicas"
              ? "bg-[#F0320C] text-white"
              : "hover:bg-[#F0320C] hover:text-white active:bg-[#F0320C] focus:bg-[#F0320C]"
            }
    `}
        >
          <BsShieldCheck className="text-2xl" />
        </button>

        <button
          onClick={() => setShowOrder(true)}
          aria-label="Carrito"
          className={`relative flex items-center justify-center flex-1 h-full transition-all group
    rounded-none
    ${showOrder
              ? "bg-[#F0320C] text-white rounded-r-3xl"
              : "hover:bg-[#F0320C] hover:text-white hover:rounded-r-3xl active:bg-[#F0320C] active:rounded-r-3xl focus:bg-[#F0320C] focus:rounded-r-3xl"
            }
    `}
        >
          <RiShoppingCart2Line className="text-2xl" />
          {cart.length > 0 && (
            <span className="absolute top-1 right-5 bg-[#2E2E2E] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </nav>


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

          {selectedCategory === "Todos" && searchTerm.trim() === "" && slides.length > 0 && (
            <div className="relative w-full mb-24 mt-4">
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
                    src={`${slides[currentIndex].src.replace("watch?v=", "embed/")}?enablejsapi=1`}
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

              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-2.5 md:p-3 rounded-full transition"
                  >
                    <MdKeyboardArrowLeft className="text-[20px] sm:text-[24px] md:text-[28px]" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-2.5 md:p-3 rounded-full transition"
                  >
                    <MdKeyboardArrowRight className="text-[20px] sm:text-[24px] md:text-[28px]" />
                  </button>
                </>
              )}

              <div
                className="absolute left-0 right-0 mx-auto rounded-2xl shadow-lg flex flex-col items-center justify-center md:flex-col lg:flex-row px-6 md:px-10 gap-3 md:gap-0"
                style={{
                  backgroundColor: "#252525ff",
                  bottom: "-50px",
                  height: "90px",
                  width: "95%",
                }}
              >
                <div className="hidden lg:flex items-center justify-center gap-10 w-full lg:w-1/2">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-[#1877F2] p-4 rounded-full text-2xl hover:scale-110 transition-transform"
                    >
                      <FaFacebookF />
                    </a>
                  )}
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black p-4 rounded-full text-2xl hover:scale-110 transition-transform"
                    >
                      <FaTiktok />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-[#E1306C] p-4 rounded-full text-2xl hover:scale-110 transition-transform"
                    >
                      <FaInstagram />
                    </a>
                  )}
                </div>

                <div className="flex flex-col text-white w-full justify-center items-center lg:items-end">
                  <div className="flex items-center gap-2 text-base md:text-lg font-semibold justify-center">
                    <RiTimeLine className="text-xl md:text-2xl" />
                    <span>Hora de atención</span>
                  </div>
                  <span className="text-sm md:text-base font-medium text-center lg:text-right">
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
    </div>
  );
};

export default Home;
