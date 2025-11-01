import React, { useState, useEffect } from "react";

const Usuarios = ({ temaEscuro }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [modoCriar, setModoCriar] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    login: "",
    senha: "",
    idFuncao: "",
  });
  const [carregando, setCarregando] = useState(false);

  const buscarUsuarios = async () => {
    setCarregando(true);
    try {
      const resposta = await window.ipc.getUsuarios();
      if (resposta?.success && Array.isArray(resposta.usuarios)) {
        setUsuarios(resposta.usuarios);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setCarregando(false);
    }
  };

  const buscarFuncoes = async () => {
    try {
      const resposta = await window.ipc.getFuncoes();
      if (resposta?.success && Array.isArray(resposta.funcoes)) {
        setFuncoes(resposta.funcoes);
      } else {
        setFuncoes([]);
      }
    } catch (err) {
      console.error("Erro ao buscar funções:", err);
    }
  };

  useEffect(() => {
    buscarUsuarios();
    buscarFuncoes();
  }, []);

  const criarUsuario = async (e) => {
    e.preventDefault();
    const { nome, login, senha, idFuncao } = novoUsuario;

    if (!nome || !login || !senha || !idFuncao) {
      alert("Preencha todos os campos!");
      return;
    }

    const resposta = await window.ipc.createUsuario({
      nome,
      login,
      senha,
      idFuncao: Number(idFuncao),
    });

    if (resposta.success) {
      alert("Usuário criado com sucesso!");
      setModoCriar(false);
      setNovoUsuario({ nome: "", login: "", senha: "", idFuncao: "" });
      buscarUsuarios();
    } else {
      alert(resposta.message || "Erro ao criar usuário");
    }
  };

  const atualizarUsuario = async (usuario) => {
    const resposta = await window.ipc.updateUsuario(usuario);
    if (resposta.success) {
      alert("Usuário atualizado!");
      buscarUsuarios();
    } else {
      alert(resposta.message || "Erro ao atualizar usuário");
    }
  };

  const excluirUsuario = async (idUsuario) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    const resposta = await window.ipc.deleteUsuario(idUsuario);
    if (resposta.success) {
      alert("Usuário excluído!");
      setUsuarios((prev) => prev.filter((u) => u.idUsuario !== idUsuario));
    } else {
      alert(resposta.message || "Erro ao excluir usuário");
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
        temaEscuro ? "bg-[#3b240f] text-yellow-200" : "bg-yellow-50 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Gerenciamento de Usuários</h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setModoCriar(false)}
          className={`px-4 py-2 rounded font-semibold ${
            !modoCriar
              ? "bg-red-600 text-white"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Visualizar
        </button>
        <button
          onClick={() => setModoCriar(true)}
          className={`px-4 py-2 rounded font-semibold ${
            modoCriar
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Criar Novo
        </button>
      </div>

      {modoCriar ? (
        <form onSubmit={criarUsuario} className="flex flex-col gap-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Nome"
            value={novoUsuario.nome}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Login"
            value={novoUsuario.login}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, login: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={novoUsuario.senha}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={novoUsuario.idFuncao}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, idFuncao: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Selecione a função</option>
            {funcoes.map((f) => (
              <option key={f.idFuncao} value={f.idFuncao}>
                {f.nome}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Criar Usuário
          </button>
        </form>
      ) : (
        <>
          {carregando ? (
            <p className="text-center">Carregando usuários...</p>
          ) : usuarios.length > 0 ? (
            <div className="flex flex-col gap-4">
              {usuarios.map((u) => (
                <div
                  key={u.idUsuario}
                  className={`flex flex-wrap items-center gap-2 border rounded p-2 ${
                    temaEscuro ? "border-yellow-600 bg-[#5a3515]" : "border-red-300 bg-white"
                  }`}
                >
                  <input
                    type="text"
                    value={u.idUsuario}
                    disabled
                    className="w-16 p-1 border rounded bg-gray-200 text-center"
                  />
                  <input
                    type="text"
                    value={u.nome}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((item) =>
                          item.idUsuario === u.idUsuario ? { ...item, nome: e.target.value } : item
                        )
                      )
                    }
                    className="flex-1 p-1 border rounded"
                  />
                  <input
                    type="text"
                    value={u.login}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((item) =>
                          item.idUsuario === u.idUsuario ? { ...item, login: e.target.value } : item
                        )
                      )
                    }
                    className="flex-1 p-1 border rounded"
                  />
                  <select
                    value={u.idFuncao}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((item) =>
                          item.idUsuario === u.idUsuario ? { ...item, idFuncao: e.target.value } : item
                        )
                      )
                    }
                    className="p-1 border rounded"
                  >
                    {funcoes.map((f) => (
                      <option key={f.idFuncao} value={f.idFuncao}>
                        {f.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => atualizarUsuario(u)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => excluirUsuario(u.idUsuario)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">Nenhum usuário encontrado.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Usuarios;
