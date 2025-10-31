import React, { useState, useEffect } from "react";

const Funcionarios = ({ temaEscuro }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [modoCriar, setModoCriar] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    login: "",
    senha: "",
    idFuncao: "",
  });
  const [carregando, setCarregando] = useState(false);

  // 🔹 Busca todos os funcionários
  const buscarFuncionarios = async () => {
    setCarregando(true);
    try {
      const resposta = await window.ipc.getFuncionarios();
      if (resposta?.success && Array.isArray(resposta.funcionarios)) {
        setUsuarios(resposta.funcionarios);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
    } finally {
      setCarregando(false);
    }
  };

  // 🔹 Busca todas as funções
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
    buscarFuncionarios();
    buscarFuncoes();
  }, []);

  // 🔹 Criação de funcionário
  const criarFuncionario = async (e) => {
    e.preventDefault();
    const { nome, login, senha, idFuncao } = novoFuncionario;

    if (!nome || !login || !senha || !idFuncao) {
      alert("Preencha todos os campos!");
      return;
    }

    const resposta = await window.ipc.createFuncionario({
      nome,
      login,
      senha,
      idFuncao: Number(idFuncao),
    });

    if (resposta.success) {
      alert("Funcionário criado com sucesso!");
      setModoCriar(false);
      setNovoFuncionario({ nome: "", login: "", senha: "", idFuncao: "" });
      buscarFuncionarios();
    } else {
      alert(resposta.message || "Erro ao criar funcionário");
    }
  };

  // 🔹 Atualização de funcionário
  const atualizarFuncionario = async (funcionario) => {
    const resposta = await window.ipc.updateFuncionario(funcionario);
    if (resposta.success) {
      alert("Funcionário atualizado!");
      buscarFuncionarios();
    } else {
      alert(resposta.message || "Erro ao atualizar funcionário");
    }
  };

  // 🔹 Exclusão de funcionário
  const excluirFuncionario = async (idUsuario) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;
    const resposta = await window.ipc.deleteFuncionario(idUsuario);
    if (resposta.success) {
      alert("Funcionário excluído!");
      setUsuarios((prev) => prev.filter((u) => u.idUsuario !== idUsuario));
    } else {
      alert(resposta.message || "Erro ao excluir funcionário");
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
        temaEscuro ? "bg-[#3b240f] text-yellow-200" : "bg-yellow-50 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Gerenciamento de Funcionários
      </h2>

      {/* 🔹 Botões de alternância */}
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

      {/* 🔹 Modo de criação */}
      {modoCriar ? (
        <form
          onSubmit={criarFuncionario}
          className="flex flex-col gap-4 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Nome"
            value={novoFuncionario.nome}
            onChange={(e) =>
              setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Login"
            value={novoFuncionario.login}
            onChange={(e) =>
              setNovoFuncionario({ ...novoFuncionario, login: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={novoFuncionario.senha}
            onChange={(e) =>
              setNovoFuncionario({ ...novoFuncionario, senha: e.target.value })
            }
            className="p-2 border rounded"
          />
          <select
            value={novoFuncionario.idFuncao}
            onChange={(e) =>
              setNovoFuncionario({ ...novoFuncionario, idFuncao: e.target.value })
            }
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
            Criar Funcionário
          </button>
        </form>
      ) : (
        // 🔹 Modo de visualização/edição
        <>
          {carregando ? (
            <p className="text-center">Carregando funcionários...</p>
          ) : usuarios.length > 0 ? (
            <div className="flex flex-col gap-4">
              {usuarios.map((u) => (
                <div
                  key={u.idUsuario}
                  className={`flex flex-wrap items-center gap-2 border rounded p-2 ${
                    temaEscuro
                      ? "border-yellow-600 bg-[#5a3515]"
                      : "border-red-300 bg-white"
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
                          item.idUsuario === u.idUsuario
                            ? { ...item, nome: e.target.value }
                            : item
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
                          item.idUsuario === u.idUsuario
                            ? { ...item, login: e.target.value }
                            : item
                        )
                      )
                    }
                    className="flex-1 p-1 border rounded"
                  />
                  <select
                    value={u.idfuncoes}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((item) =>
                          item.idUsuario === u.idUsuario
                            ? { ...item, idfuncoes: e.target.value }
                            : item
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
                    onClick={() => atualizarFuncionario(u)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => excluirFuncionario(u.idUsuario)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">Nenhum funcionário encontrado.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Funcionarios;
