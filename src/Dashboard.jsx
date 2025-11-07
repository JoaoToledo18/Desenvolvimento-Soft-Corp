import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import GraficoBarra from "./components/Charts/ChartBar";
import GraficoPizza from "./components/Charts/ChartPie";
import GraficoLinha from "./components/Charts/ChartLine";
import GraficoPolar from "./components/Charts/ChartPolar";
import Produtos from "./components/Produtos";
import Usuarios from "./components/Usuarios";

const DashboardLayout = () => {
  const [tabelas, setTabelas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [vendas, setVendas] = useState([]);
  const [carregandoVendas, setCarregandoVendas] = useState(false);
  const [mostrarDashboard, setMostrarDashboard] = useState(true);

  const mapearTabelas = (tables) => {
    const mapa = [];
    if (tables.includes("vendaProduto")) mapa.push("Pedidos");
    if (tables.includes("usuarios")) mapa.push("Funcionários");
    if (tables.includes("produtos")) mapa.push("Produtos");
    if (tables.includes("entradasestoque")) mapa.push("Estoque");
    if (tables.includes("log_auditoria")) mapa.push("Histórico");
    return mapa;
  };

  useEffect(() => {
    const fetchTabelas = async () => {
      const resposta = await window.ipc.getPermissions();
      if (resposta.success && Array.isArray(resposta.tables)) {
        const tabelasFiltradas = mapearTabelas(resposta.tables);
        setTabelas(tabelasFiltradas);
        if (tabelasFiltradas.length > 0) setSelecionado(null);
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
  const valores = vendas.map((item) => item.TotalVendida);

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];
  const vendasMensais = [65, 59, 80, 81, 56, 55, 40];
  const categorias = ["Lanches", "Bebidas", "Sobremesas", "Combos", "Extras"];
  const proporcao = [35, 25, 15, 15, 10];
  const desempenho = [11, 16, 7, 3, 14];

  const handleSelecionar = (item) => {
    setSelecionado(item);
    setMostrarDashboard(false);
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Header
        temaEscuro={temaEscuro}
        alternarTema={alternarTema}
        logout={logout}
      />

      <Menu
        tabelas={tabelas}
        selecionado={selecionado}
        setSelecionado={handleSelecionar}
        temaEscuro={temaEscuro}
      />

      <main className="flex-1 p-6">
        {mostrarDashboard ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              📊 Dashboard Principal
            </h2>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-colors duration-300`}
            >
              <div
                className={`border-2 rounded-xl p-4 shadow-lg flex flex-col justify-center ${
                  temaEscuro
                    ? "border-yellow-600 bg-[#3b240f]"
                    : "border-red-400 bg-yellow-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3 text-center text-red-700 dark:text-yellow-300">
                  Top Vendas
                </h3>
                <div className="h-[300px] flex items-center justify-center">
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
              </div>

              <div
                className={`border-2 rounded-xl p-4 shadow-lg flex flex-col justify-center ${
                  temaEscuro
                    ? "border-yellow-600 bg-[#3b240f]"
                    : "border-red-400 bg-yellow-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3 text-center text-red-700 dark:text-yellow-300">
                  Proporção de Categorias
                </h3>
                <GraficoPizza
                  labels={categorias}
                  valores={proporcao}
                  titulo="Categorias mais vendidas"
                  nomeDataset="Vendas (%)"
                />
              </div>

              <div
                className={`border-2 rounded-xl p-4 shadow-lg flex flex-col justify-center ${
                  temaEscuro
                    ? "border-yellow-600 bg-[#3b240f]"
                    : "border-red-400 bg-yellow-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3 text-center text-red-700 dark:text-yellow-300">
                  Desempenho por Setor
                </h3>
                <GraficoPolar
                  labels={[
                    "Financeiro",
                    "Cozinha",
                    "Atendimento",
                    "Marketing",
                    "TI",
                  ]}
                  valores={desempenho}
                  titulo="Desempenho Setorial"
                  nomeDataset="Indicadores"
                />
              </div>

              <div
                className={`border-2 rounded-xl p-4 shadow-lg xl:col-span-2 ${
                  temaEscuro
                    ? "border-yellow-600 bg-[#3b240f]"
                    : "border-red-400 bg-yellow-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3 text-center text-red-700 dark:text-yellow-300">
                  Desempenho Mensal
                </h3>
                <GraficoLinha
                  labels={meses}
                  valores={vendasMensais}
                  titulo="Evolução das Vendas"
                  nomeDataset="Vendas Mensais"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {selecionado === "Produtos" && <Produtos temaEscuro={temaEscuro} />}
            {selecionado === "Funcionários" && (
              <Usuarios temaEscuro={temaEscuro} />
            )}
            {!["Produtos", "Funcionários"].includes(selecionado) && (
              <div
                className={`w-full min-h-[400px] flex items-center justify-center rounded-lg border-2 p-6 text-xl font-semibold transition-colors duration-300 ${
                  temaEscuro
                    ? "border-yellow-600 bg-[#3b240f] text-yellow-200"
                    : "border-red-400 bg-yellow-50 text-red-700"
                }`}
              >
                <p>Módulo selecionado: {selecionado}</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;