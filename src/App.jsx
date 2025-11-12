import React, { useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";
import Gerenciamento from "./components/Produtos";
import usePermissions from "./hooks/usePermissons";

export default function App() {
  const [logado, setLogado] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState("dashboard");

  const alternarTema = () => setTemaEscuro(!temaEscuro);
  const logout = () => window.location.reload();

  const { tabelasMenu, carregandoMenu, permissoesPorTabela } = usePermissions(logado);

  if (!logado) return <Login onLoginSucesso={() => setLogado(true)} />;

  const paginas = {
    dashboard: <Dashboard temaEscuro={temaEscuro} />,
    categorias: (
      <Gerenciamento
        permissoes={permissoesPorTabela?.categorias}
        temaEscuro={temaEscuro}
      />
    ),
    produtos: (
      <Gerenciamento
        permissoes={permissoesPorTabela?.produtos}
        temaEscuro={temaEscuro}
      />
    ),
    vendas: <Dashboard temaEscuro={temaEscuro} />,
    "funcionários": <Dashboard temaEscuro={temaEscuro} />,
    "histórico": <Dashboard temaEscuro={temaEscuro} />,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header temaEscuro={temaEscuro} alternarTema={alternarTema} logout={logout} />
      <Menu
        tabelas={carregandoMenu ? [] : tabelasMenu}
        selecionado={paginaAtual}
        setSelecionado={setPaginaAtual}
        temaEscuro={temaEscuro}
      />
      <main className="flex-1 p-6">
        {paginas[paginaAtual] || <Dashboard temaEscuro={temaEscuro} />}
      </main>
    </div>
  );
}
