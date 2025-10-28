import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import GraficoBarra from "./components/ChartBar"; 

const DashboardLayout = () => {
  const [tabelas, setTabelas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [vendas, setVendas] = useState([]);
  const [carregandoVendas, setCarregandoVendas] = useState(false);

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
    const buscarVendas = async () => {
      setCarregandoVendas(true);
      try {
        const resposta = await window.ipc.getMaioresVendas();
        if (resposta && resposta.success) {
          setVendas(Array.isArray(resposta.vendas) ? resposta.vendas : []);
        }
      } catch (err) {
        console.error("Erro ao buscar vendas", err);
      } finally {
        setCarregandoVendas(false);
      }
    };
    buscarVendas();
  }, []);

  useEffect(() => {
    document.body.className = temaEscuro
      ? "bg-[#2c1a09] text-yellow-300" 
      : "bg-gradient-to-b from-yellow-50 via-orange-100 to-red-100 text-black";
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const logout = () => {};

  const labels = vendas.map((item) => item.Produto);
  const valores = vendas.map((item) => item.Total);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Header
        temaEscuro={temaEscuro}
        alternarTema={alternarTema}
        logout={logout}
      />

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

      <main className="flex-1 p-6">
        {selecionado ? (
          <h2 className="text-2xl font-bold mb-4 text-center">
            Tabela: {selecionado}
          </h2>
        ) : (
          <h2 className="text-2xl font-bold mb-4 text-center">
            Selecione uma tabela
          </h2>
        )}

        <div
          className={`w-full min-h-[300px] border-2 rounded-lg p-4 shadow-md transition-colors duration-300 ${
            temaEscuro
              ? "border-yellow-600 bg-[#3b240f]"
              : "border-red-400 bg-yellow-50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2 text-center text-red-700 dark:text-yellow-300">
            Top Vendas
          </h3>

          {carregandoVendas ? (
            <p className="text-center">Carregando maiores vendas...</p>
          ) : vendas.length > 0 ? (
            <GraficoBarra
              labels={labels}
              valores={valores}
              titulo="Top Vendas"
              nomeDataset="Quantidade Vendida"
            />
          ) : (
            <p className="text-center">Nenhuma venda encontrada.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
