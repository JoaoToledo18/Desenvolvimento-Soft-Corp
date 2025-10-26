import React, { useState, useEffect } from "react";

const DashboardLayout = () => {
  const [tabelas, setTabelas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    const fetchTabelas = async () => {
      const resposta = await window.ipc.getPermissions();
      if (resposta.success) {
        setTabelas(resposta.tables);
        setSelecionado(resposta.tables[0]);
      }
    };
    fetchTabelas();
  }, []);

  useEffect(() => {
    document.body.className = temaEscuro ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const logout = () => {

  };

  return (
    <div className="flex flex-col min-h-screen">
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

      <nav className="flex overflow-x-auto gap-2 p-2 bg-gray-300 dark:bg-gray-700">
        {tabelas.map((tabela) => (
          <button
            key={tabela}
            onClick={() => setSelecionado(tabela)}
            className={`flex-shrink-0 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              selecionado === tabela
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
            }`}
            aria-current={selecionado === tabela ? "page" : undefined}
          >
            {tabela}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4">
        {selecionado ? (
          <h2 className="text-xl font-semibold mb-4">Conteúdo da tabela: {selecionado}</h2>
        ) : (
          <h2 className="text-xl font-semibold mb-4">Selecione uma tabela</h2>
        )}

        <div className="w-full min-h-[300px] border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4">
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
