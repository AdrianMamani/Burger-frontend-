// src/components/shared/HeaderAdmin.jsx
import { RiSearchLine, RiUser3Line, RiMenuLine } from "react-icons/ri";

const HeaderAdmin = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white px-8 py-4 border-b border-gray-200">
      {/* Botón para colapsar sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-2xl text-gray-600 hover:text-[#ec7c6a] focus:outline-none"
      >
        <RiMenuLine />
      </button>

      {/* Buscador */}
      <div className="relative w-1/3">
        <RiSearchLine className="absolute left-3 top-3 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec7c6a]"
        />
      </div>

      {/* Perfil */}
      <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-full px-3 py-1 transition">
        <RiUser3Line className="text-2xl text-gray-700" />
        <span className="text-gray-700 font-medium">Administrador</span>
      </div>
    </header>
  );
};

export default HeaderAdmin;
