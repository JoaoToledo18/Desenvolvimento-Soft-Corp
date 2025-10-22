import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleToggleSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = async () => {
    if (!usuario || !senha) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // Chama o backend via IPC
      const resposta = await window.ipc.login(usuario, senha);

      if (resposta.sucesso) {
        setMensagem(`✅ Bem-vindo, ${resposta.usuario.nome}!`);
        console.log("Usuário logado:", resposta.usuario);

        // Exemplo: redirecionar para outra página
        // window.location.href = "/home";
      } else {
        setMensagem(`❌ ${resposta.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMensagem("Erro interno. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="src/images/logo reansparente.png" alt="Logo da empresa" />
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
          <i
            id="toggleSenha"
            onClick={handleToggleSenha}
            style={{ cursor: "pointer" }}
          >
            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
          </i>
        </div>

        <button
          type="button"
          className="btn-entrar"
          id="btn"
          onClick={handleLogin}
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        {mensagem && (
          <p
            style={{
              marginTop: "10px",
              color: mensagem.includes("✅") ? "green" : "red",
            }}
          >
            {mensagem}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
