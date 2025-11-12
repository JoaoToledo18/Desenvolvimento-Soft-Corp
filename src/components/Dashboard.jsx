import React, { useState } from "react";
import GraficoBarra from "./Charts/ChartBar";
import GraficoPizza from "./Charts/ChartPie";
import GraficoLinha from "./Charts/ChartLine";
import GraficoPolar from "./Charts/ChartPolar";

export default function Dashboard({ temaEscuro, vendas, carregandoVendas }) {
  const [selecionado, setSelecionado] = useState(null);

  // Dados fictícios para gráficos
  const labels = vendas?.map((item) => item.Produto) || [];
  const valores = vendas?.map((item) => item.TotalVendida) || [];
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];
  const vendasMensais = [65, 59, 80, 81, 56, 55, 40];
  const categorias = ["Lanches", "Bebidas", "Sobremesas", "Combos", "Extras"];
  const proporcao = [35, 25, 15, 15, 10];
  const desempenho = [11, 16, 7, 3, 14];

  return (
    <main className="flex-1 p-6">
      {!selecionado ? (
        <DashboardMain
          temaEscuro={temaEscuro}
          carregandoVendas={carregandoVendas}
          vendas={vendas}
          labels={labels}
          valores={valores}
          categorias={categorias}
          proporcao={proporcao}
          meses={meses}
          vendasMensais={vendasMensais}
          desempenho={desempenho}
        />
      ) : (
        <ConteudoSelecionado selecionado={selecionado} temaEscuro={temaEscuro} />
      )}
    </main>
  );
}

function DashboardMain({
  temaEscuro,
  carregandoVendas,
  vendas,
  labels,
  valores,
  categorias,
  proporcao,
  meses,
  vendasMensais,
  desempenho,
}) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">📊 Dashboard Principal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card titulo="Top Vendas" temaEscuro={temaEscuro}>
          {carregandoVendas ? (
            <p className="text-center">Carregando maiores vendas...</p>
          ) : vendas?.length > 0 ? (
            <GraficoBarra
              labels={labels}
              valores={valores}
              titulo="Top Vendas"
              nomeDataset="Quantidade Vendida"
            />
          ) : (
            <p className="text-center">Nenhuma venda encontrada.</p>
          )}
        </Card>

        <Card titulo="Proporção de Categorias" temaEscuro={temaEscuro}>
          <GraficoPizza
            labels={categorias}
            valores={proporcao}
            titulo="Categorias mais vendidas"
            nomeDataset="Vendas (%)"
          />
        </Card>

        <Card titulo="Desempenho por Setor" temaEscuro={temaEscuro}>
          <GraficoPolar
            labels={["Financeiro", "Cozinha", "Atendimento", "Marketing", "TI"]}
            valores={desempenho}
            titulo="Desempenho Setorial"
            nomeDataset="Indicadores"
          />
        </Card>

        <Card titulo="Desempenho Mensal" temaEscuro={temaEscuro} className="xl:col-span-2">
          <GraficoLinha
            labels={meses}
            valores={vendasMensais}
            titulo="Evolução das Vendas"
            nomeDataset="Vendas Mensais"
          />
        </Card>
      </div>
    </>
  );
}

function Card({ titulo, temaEscuro, className = "", children }) {
  return (
    <div
      className={`border-2 rounded-xl p-4 shadow-lg flex flex-col justify-center transition-colors duration-300 ${className} ${
        temaEscuro
          ? "border-yellow-600 bg-[#3b240f]"
          : "border-red-400 bg-yellow-50"
      }`}
    >
      <h3 className="text-lg font-semibold mb-3 text-center text-red-700 dark:text-yellow-300">
        {titulo}
      </h3>
      <div className="h-[300px] flex items-center justify-center">{children}</div>
    </div>
  );
}

function ConteudoSelecionado({ selecionado, temaEscuro }) {
  if (selecionado === "Produtos") return <Produtos temaEscuro={temaEscuro} />;
  if (selecionado === "Funcionários") return <Usuarios temaEscuro={temaEscuro} />;

  return (
    <div
      className={`w-full min-h-[400px] flex items-center justify-center rounded-lg border-2 p-6 text-xl font-semibold transition-colors duration-300 ${
        temaEscuro
          ? "border-yellow-600 bg-[#3b240f] text-yellow-200"
          : "border-red-400 bg-yellow-50 text-red-700"
      }`}
    >
      <p>Módulo selecionado: {selecionado}</p>
    </div>
  );
}
