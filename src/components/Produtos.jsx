import React, { useState, useEffect } from "react";

export default function Gerenciamento({ permissoes }) {
  const [tela, setTela] = useState("categorias");
  const [dados, setDados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    preco: "",
    categoriaId: "",
  });
  const [editando, setEditando] = useState(false);

  const podeCriar = permissoes?.insert || false;
  const podeEditar = permissoes?.update || false;
  const podeRemover = permissoes?.delete || false;

  useEffect(() => {
    carregarDados();
  }, [tela]);

  async function carregarDados() {
    try {
      if (tela === "categorias") {
        const res = await window.ipc.categorias.listar();
        setDados(res?.success && Array.isArray(res.data) ? res.data : []);
      } else {
        const prods = await window.ipc.produtos.listar();
        const cats = await window.ipc.categorias.listar();

        setCategorias(
          cats?.success && Array.isArray(cats.data) ? cats.data : []
        );
        setDados(prods?.success && Array.isArray(prods.data) ? prods.data : []);
      }
    } catch {
      setDados([]);
    }
    limparFormulario();
  }

  function limparFormulario() {
    setForm({ id: null, nome: "", preco: "", categoriaId: "" });
    setEditando(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (tela === "categorias") {
        if (editando) await window.ipc.categorias.editar(form.id, form.nome);
        else await window.ipc.categorias.criar(form.nome);
      } else {
        if (editando)
          await window.ipc.produtos.editar(
            form.id,
            form.nome,
            form.preco,
            form.categoriaId
          );
        else
          await window.ipc.produtos.criar(
            form.nome,
            form.preco,
            form.categoriaId
          );
      }
      await carregarDados();
    } catch {}
  }

  function handleEditar(item) {
    setEditando(true);
    if (tela === "categorias")
      setForm({ id: item.idCategorias, nome: item.nome });
    else
      setForm({
        id: item.idProdutos,
        nome: item.nome,
        preco: item.preco,
        categoriaId: item.categorias_idCategorias,
      });
  }

  async function handleRemover(id) {
    try {
      if (tela === "categorias") await window.ipc.categorias.remover(id);
      else await window.ipc.produtos.remover(id);
      await carregarDados();
    } catch {}
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded ${
            tela === "categorias" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTela("categorias")}
        >
          Categorias
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tela === "produtos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTela("produtos")}
        >
          Produtos
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-bold mb-4">
          Lista de {tela === "categorias" ? "Categorias" : "Produtos"}
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nome</th>
              {tela === "produtos" && <th className="p-2 text-left">Preço</th>}
              {tela === "produtos" && (
                <th className="p-2 text-left">Categoria</th>
              )}
              {(podeEditar || podeRemover) && (
                <th className="p-2 text-center">Ações</th>
              )}
            </tr>
          </thead>

          <tbody>
            {dados.length > 0 ? (
              dados.map((item) => (
                <tr
                  key={
                    tela === "categorias" ? item.idCategorias : item.idProdutos
                  }
                  className="border-b"
                >
                  <td className="p-2">{item.nome}</td>

                  {tela === "produtos" && (
                    <>
                      <td className="p-2">R$ {item.preco}</td>
                      <td className="p-2">
                        {categorias.find(
                          (c) => c.idCategorias === item.categorias_idCategorias
                        )?.nome || "-"}
                      </td>
                    </>
                  )}

                  {(podeEditar || podeRemover) && (
                    <td className="p-2 text-center flex gap-2 justify-center">
                      {podeEditar && (
                        <button
                          onClick={() => handleEditar(item)}
                          className="bg-yellow-400 px-3 py-1 rounded"
                        >
                          Editar
                        </button>
                      )}
                      {podeRemover && (
                        <button
                          onClick={() =>
                            handleRemover(
                              tela === "categorias"
                                ? item.idCategorias
                                : item.idProdutos
                            )
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Deletar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tela === "produtos" ? 4 : 2}
                  className="text-center p-4 italic text-gray-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(podeCriar || editando) && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-4">
            {editando ? "Editar" : "Novo"}{" "}
            {tela === "categorias" ? "Categoria" : "Produto"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              className="border p-2 rounded"
            />

            {tela === "produtos" && (
              <>
                <input
                  type="number"
                  placeholder="Preço"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  required
                  className="border p-2 rounded"
                />

                <select
                  value={form.categoriaId}
                  onChange={(e) =>
                    setForm({ ...form, categoriaId: e.target.value })
                  }
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((c) => (
                    <option key={c.idCategorias} value={c.idCategorias}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {editando ? "Atualizar" : "Criar"}
              </button>

              {editando && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
