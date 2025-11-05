import React from "react";

const Menu = ({ tabelas, selecionado, setSelecionado, temaEscuro }) => {
  return (
    <nav
      className={`flex overflow-x-auto gap-2 p-2 transition-colors duration-300 ${
        temaEscuro
          ? "bg-[#3b240f] text-yellow-200"
          : "bg-gradient-to-r from-yellow-400 to-red-500 text-white"
      }`}
    >
      {tabelas.map((tabela) => (
        <button
          key={tabela}
          onClick={() => setSelecionado(tabela)}
          className={`flex-shrink-0 px-4 py-2 rounded font-semibold transition-all duration-200 ${
            selecionado === tabela
              ? temaEscuro
                ? "bg-yellow-500 text-black shadow-md"
                : "bg-red-700 text-white shadow-md"
              : temaEscuro
                ? "bg-[#5a3515] text-yellow-200 hover:bg-[#70421c]"
                : "bg-yellow-200 text-red-800 hover:bg-yellow-300"
          }`}
          aria-current={selecionado === tabela ? "page" : undefined}
        >
          {tabela}
        </button>
      ))}
    </nav>
  );
};

export default Menu;
