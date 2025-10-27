import React from "react";

const Header = ({ temaEscuro, alternarTema, logout }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-200 dark:bg-gray-800">
      <div className="flex items-center mb-2 md:mb-0">
        <span className="text-2xl font-bold">LOGO</span>
      </div>

      <div className="flex gap-2 items-center mb-2 md:mb-0">
        <button
          onClick={alternarTema}
          className="px-3 py-1 rounded bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          {temaEscuro ? "Modo Claro" : "Modo Escuro"}
        </button>
      </div>

      <div>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          Encerrar Sessão
        </button>
      </div>
    </header>
  );
};

export default Header;
