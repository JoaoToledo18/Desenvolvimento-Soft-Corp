import React, { useEffect, useState } from "react";

export default function Usuarios({ permissoes }) {
  const [usuarios, setUsuarios] = useState([]);

  // 🔹 Campos do formulário de criação
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    login: "",
    senha: "",
  });

  // 🔹 Carregar usuários ao iniciar
  async function carregarUsuarios() {
    try {
      const retorno = await window.ipc.usuarios.listar();

      if (Array.isArray(retorno)) {
        setUsuarios(retorno);
      } else {
        console.warn("⚠ Formato inesperado do retorno:", retorno);
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setUsuarios([]);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // 🔹 Criar usuário
  async function criarUsuario(e) {
    e.preventDefault();

    if (!novoUsuario.nome || !novoUsuario.login || !novoUsuario.senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const resultado = await window.ipc.usuarios.criar(novoUsuario);

      if (resultado?.sucesso) {
        alert("Usuário criado com sucesso!");
        setNovoUsuario({ nome: "", login: "", senha: "" });
        carregarUsuarios(); // Atualiza a lista
      } else {
        alert("Erro ao criar usuário: " + (resultado?.erro || "Desconhecido"));
      }
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      alert("Erro ao criar usuário.");
    }
  }

  // 🔹 Atualiza estado local e envia para o banco
  const togglePermissao = async (idUsuario, idPermissao, campo) => {
    const novos = usuarios.map((u) => {
      if (u.id !== idUsuario) return u;

      return {
        ...u,
        permissoes: u.permissoes.map((p) =>
          p.idPermissoes === idPermissao
            ? { ...p, [campo]: p[campo] ? 0 : 1 }
            : p
        ),
      };
    });

    setUsuarios(novos);

    const usuario = novos.find((u) => u.id === idUsuario);

    try {
      await window.ipc.usuarios.alterarPermissoes({
        idUsuario,
        permissoes: usuario.permissoes,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Usuários e Permissões</h2>

      {/* 🔹 Formulário de criação */}
      <div
        style={{
          padding: 15,
          border: "1px solid #888",
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <h3>Criar Novo Usuário</h3>

        <form onSubmit={criarUsuario} style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 10 }}>
            <label>Nome:</label>
            <input
              type="text"
              value={novoUsuario.nome}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, nome: e.target.value })
              }
              style={{ marginLeft: 10 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Login:</label>
            <input
              type="text"
              value={novoUsuario.login}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, login: e.target.value })
              }
              style={{ marginLeft: 10 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Senha:</label>
            <input
              type="password"
              value={novoUsuario.senha}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, senha: e.target.value })
              }
              style={{ marginLeft: 10 }}
            />
          </div>

          <button type="submit">Criar Usuário</button>
        </form>
      </div>

      {/* 🔹 Lista de usuários */}
      {!usuarios.length ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        usuarios.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginTop: 15,
              borderRadius: 6,
            }}
          >
            <strong>
              {user.nome} - <small>({user.login})</small>
            </strong>

            {user.permissoes?.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: 10,
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th>Tabela</th>
                    <th>Visualizar</th>
                    <th>Cadastrar</th>
                    <th>Atualizar</th>
                    <th>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {user.permissoes.map((perm) => (
                    <tr key={perm.idPermissoes}>
                      <td>{perm.tabela}</td>
                      {["select", "insert", "update", "delete"].map((tipo) => (
                        <td key={tipo}>
                          <input
                            type="checkbox"
                            checked={perm[tipo] === 1}
                            onChange={() =>
                              togglePermissao(user.id, perm.idPermissoes, tipo)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ marginTop: 10 }}>
                Nenhuma permissão cadastrada para este usuário.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
