import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import GraficoBarra from "./components/ChartBar"; // importa o gráfico

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
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-black";
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const logout = () => {};

  // Preparar dados para o gráfico
  const labels = vendas.map((item) => item.produto);
  const valores = vendas.map((item) => item.totalVendida);

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
          <h2 className="text-xl font-semibold mb-4">Selecione uma tabela</h2>
        )}

        <div className="w-full min-h-[300px] border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Top Vendas</h3>
          {carregandoVendas ? (
            <p>Carregando maiores vendas...</p>
          ) : vendas.length > 0 ? (
            <>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {vendas.map((item, index) => (
                  <li key={index}>
                    {item.Produto} — {item.Total} vendas
                  </li>
                ))}
              </ul>
              {/* Gráfico de barras */}
              <GraficoBarra
                labels={labels}
                valores={valores}
                titulo="Top Vendas"
                nomeDataset="Quantidade Vendida"
              />
            </>
          ) : (
            <p>Nenhuma venda encontrada.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
