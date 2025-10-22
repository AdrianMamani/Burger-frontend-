import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/administrador");
      if (!response.ok) {
        throw new Error("Error al conectar con el servidor");
      }

      const admin = await response.json();

      // Validar email
      if (email !== admin.email) {
        setError("Correo electrónico incorrecto");
        return;
      }

      // Comparar contraseñas
      // Tu backend tiene una contraseña hasheada con bcrypt ($2y$...),
      // por eso necesitamos verificarla con una ruta en el backend.
      // Pero si solo estás probando, puedes hacerlo así temporalmente:
      const bcrypt = await import("bcryptjs");
      const match = await bcrypt.compare(password, admin.contrasena);

      if (!match) {
        setError("Contraseña incorrecta");
        return;
      }

      // ✅ Login correcto
      alert("Inicio de sesión exitoso");
      // Aquí podrías guardar en localStorage y redirigir
      // localStorage.setItem("admin", JSON.stringify(admin));
      // window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-3">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Correo electrónico</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@correo.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
