import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { RiHome6Line } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import { FaBook } from "react-icons/fa";

const Sidebar = ({ showMenu, darkMode, empresa }) => {
  const location = useLocation();
  const [active, setActive] = useState("/home");

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const bgSidebar = "bg-[#141414]";
  const bgItemHover = darkMode ? "hover:bg-[#262837]" : "hover:bg-gray-100";
  const iconColor = "text-[#F0320C]";
  const bgActive = darkMode ? "bg-[#262837]" : "bg-gray-100";
  const bgButtonActive = "bg-[#F0320C] text-white";

  const menuItems = [
    { path: "/home", icon: <RiHome6Line className="text-2xl" />, label: "Inicio" },
    { path: "/politicas", icon: <BsShieldCheck className="text-2xl" />, label: "Políticas" },
    { path: "/terminos", icon: <FaBook className="text-2xl" />, label: "Términos" },
  ];

  return (
    <div
      className={`${bgSidebar} fixed lg:left-0 top- w-28 h-full flex flex-col justify-between py-16 z-50 transition-all ${
        showMenu ? "left-0" : "-left-full"
      }`}
    >
      <div>
        <ul className="pl-4 flex flex-col gap-6">
          {menuItems.map((item, index) => {
            const isActive = active === item.path;
            return (
              <li
                key={index}
                className={`relative p-4 rounded-tl-xl rounded-bl-xl group transition-colors cursor-pointer ${
                  isActive ? bgActive : bgItemHover
                }`}
                onClick={() => setActive(item.path)}
              >
                <div className="relative flex justify-center">
                  <Link
                    to={item.path}
                    className={`flex justify-center items-center p-4 rounded-xl transition-colors ${
                      isActive
                        ? `${bgButtonActive}`
                        : `group-hover:bg-[#F0320C] ${iconColor} group-hover:text-white`
                    }`}
                  >
                    {item.icon}
                  </Link>

                  <span
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100
                    bg-[#F0320C] text-white text-xs px-2 py-1 rounded-md transition-all duration-200
                    translate-y-2 group-hover:translate-y-0 whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Redes Sociales1 */}
      {empresa && (
        <div className="mb-6 flex flex-col items-center gap-6">
          {empresa.facebook_url && (
            <a
              href={empresa.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-[#F0320C] transition-colors"
            >
              <i className="ri-facebook-fill"></i>
            </a>
          )}

          {empresa.instagram_url && (
            <a
              href={empresa.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-[#F0320C] transition-colors"
            >
              <i className="ri-instagram-line"></i>
            </a>
          )}

          {empresa.tiktok_url && (
            <a
              href={empresa.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-3xl hover:text-[#F0320C] transition-colors"
            >
              <i className="ri-tiktok-fill"></i>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
