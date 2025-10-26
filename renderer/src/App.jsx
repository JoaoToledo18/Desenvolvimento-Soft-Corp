import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./Dashboard";


export default function App() {
  const [logado, setLogado] = useState(false);

  return (
    <>
      {logado ? (
        <Dashboard />
      ) : (
        <Login onLoginSucesso={() => setLogado(true)} />
      )}
    </>
  );
}
