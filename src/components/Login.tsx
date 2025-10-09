import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleToggleSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = () => {
    // logica auth
  };

   const caminhoImages = "../../public/assets/"

  return (
    <div className="login-container">
      <div className="logo">
        <img src={caminhoImages+"logo reansparente.png"} alt="Logo da empresa" />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="usuario">USUÁRIO:</label>
        <br />
        <input
          type="text"
          id="usuario"
          name="usuario"
          placeholder="Digite seu usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <br />

        <label htmlFor="senha">SENHA:</label>
        <br />
        <div className="senha-container">
          <input
            type={mostrarSenha ? "text" : "password"}
            id="senha"
            name="senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <i id="toggleSenha" onClick={handleToggleSenha} style={{ cursor: "pointer" }}>
            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
          </i>
        </div>

        <button type="button" className="btn-entrar" id="btn" onClick={handleLogin}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
