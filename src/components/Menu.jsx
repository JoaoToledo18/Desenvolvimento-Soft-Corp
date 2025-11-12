import React from "react";

const Menu = ({ tabelas = [], selecionado, setSelecionado, temaEscuro }) => {
  const baseClasses = temaEscuro
    ? "bg-[#3b240f] text-yellow-200"
    : "bg-gradient-to-r from-yellow-400 to-red-500 text-white";

  const botaoBase =
    "flex-shrink-0 px-4 py-2 rounded font-semibold transition-all duration-200";

  return (
    <nav className={`flex overflow-x-auto gap-2 p-2 ${baseClasses}`}>
      {tabelas.length === 0 ? (
        <p className="px-4 py-2 italic opacity-75">Carregando menu...</p>
      ) : (
        tabelas.map((tabela) => {
          const isSelecionado = selecionado === tabela;
          const estiloBotao = isSelecionado
            ? temaEscuro
              ? "bg-yellow-500 text-black shadow-md"
              : "bg-red-700 text-white shadow-md"
            : temaEscuro
            ? "bg-[#5a3515] text-yellow-200 hover:bg-[#70421c]"
            : "bg-yellow-200 text-red-800 hover:bg-yellow-300";

          return (
            <button
              key={tabela}
              onClick={() => setSelecionado(tabela.toLowerCase())}
              className={`${botaoBase} ${estiloBotao}`}
              aria-current={isSelecionado ? "page" : undefined}
            >
              {tabela.charAt(0).toUpperCase() + tabela.slice(1)}
            </button>
          );
        })
      )}
    </nav>
  );
};

export default Menu;
