import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import GraficoBarra from "./components/ChartBar";

const DashboardLayout = () => {
  const [tabelas, setTabelas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [vendas, setVendas] = useState([])

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

  useEffect(()=> {
    const vendas = async () => {
      const resposta = await window.ipc.getMaioresVendas();
      if (resposta.success) {
        setVendas(resposta.vendas)
      }
    }
  })

  useEffect(() => {
    document.body.className = temaEscuro
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-black";
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const logout = () => {};

  return (
    <div className="flex flex-col min-h-screen">
      <Header temaEscuro={temaEscuro} alternarTema={alternarTema} logout={logout} />

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
          <h2 className="text-xl font-semibold mb-4">
            Conteúdo da tabela: {selecionado}
          </h2>
        ) : (
          <h2 className="text-xl font-semibold mb-4">
            Selecione uma tabela
          </h2>
        )}

        <div className="w-full min-h-[300px] border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4">
          {
            vendas
          }
          <GraficoBarra 
            labels={["X-tudo", "X-salada", "X-bacon"]}
            valores={[10,11,4]}
            titulo="Maiores vendas"
            nomeDataset="nº de vendas"
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
