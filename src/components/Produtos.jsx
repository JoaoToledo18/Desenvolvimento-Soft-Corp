import React, { useState, useEffect } from "react";

const Produtos = ({ temaEscuro }) => {
  const [produtos, setProdutos] = useState([]);
  const [modoCriar, setModoCriar] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    preco: "",
  });
  const [carregando, setCarregando] = useState(false);

  const buscarProdutos = async () => {
    setCarregando(true);
    try {
      const resposta = await window.ipc.getProdutos();
      if (resposta.success && Array.isArray(resposta.produtos)) {
        setProdutos(resposta.produtos);
      } else {
        setProdutos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const atualizarProduto = async (produto) => {
    const produtoAtualizado = { ...produto, preco: Number(produto.preco) };
    const resposta = await window.ipc.updateProduto(produtoAtualizado);
    if (resposta.success) {
      buscarProdutos();
    } else {
      alert("Erro ao atualizar produto");
    }
  };

  const excluirProduto = async (idProduto) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const resposta = await window.ipc.deleteProduto(idProduto); 
    if (resposta.success) {
      setProdutos(produtos.filter((p) => p.idProduto !== idProduto));
    } else {
      alert("Erro ao excluir produto");
    }
  };

  const criarProduto = async (e) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.categoria || !novoProduto.preco) {
      alert("Preencha todos os campos!");
      return;
    }
    const resposta = await window.ipc.createProduto(
      novoProduto.nome,
      novoProduto.categoria,
      Number(novoProduto.preco) 
    );
    if (resposta.success) {
      setModoCriar(false);
      setNovoProduto({ nome: "", categoria: "", preco: "" });
      buscarProdutos();
    } else {
      alert("Erro ao criar produto");
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
        temaEscuro ? "bg-[#3b240f] text-yellow-200" : "bg-yellow-50 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Gerenciamento de Produtos
      </h2>

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
        <form
          onSubmit={criarProduto}
          className="flex flex-col gap-4 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Nome do produto"
            value={novoProduto.nome}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, nome: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Categoria"
            value={novoProduto.categoria}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, categoria: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Preço"
            value={novoProduto.preco}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, preco: e.target.value })
            }
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Criar Produto
          </button>
        </form>
      ) : (
        <>
          {carregando ? (
            <p className="text-center">Carregando produtos...</p>
          ) : produtos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {produtos.map((p) => (
                <div
                  key={p.idProduto}
                  className={`flex flex-wrap items-center gap-2 border rounded p-2 ${
                    temaEscuro
                      ? "border-yellow-600 bg-[#5a3515]"
                      : "border-red-300 bg-white"
                  }`}
                >
                  <input
                    type="text"
                    value={p.idProduto}
                    disabled
                    className="w-16 p-1 border rounded bg-gray-200 text-center"
                  />
                  <input
                    type="text"
                    value={p.nome}
                    onChange={(e) =>
                      setProdutos((prev) =>
                        prev.map((item) =>
                          item.idProduto === p.idProduto
                            ? { ...item, nome: e.target.value }
                            : item
                        )
                      )
                    }
                    className="flex-1 p-1 border rounded"
                  />
                  <input
                    type="text"
                    value={p.categoria}
                    onChange={(e) =>
                      setProdutos((prev) =>
                        prev.map((item) =>
                          item.idProduto === p.idProduto
                            ? { ...item, categoria: e.target.value }
                            : item
                        )
                      )
                    }
                    className="flex-1 p-1 border rounded"
                  />
                  <input
                    type="number"
                    value={p.preco}
                    onChange={(e) =>
                      setProdutos((prev) =>
                        prev.map((item) =>
                          item.idProduto === p.idProduto
                            ? { ...item, preco: e.target.value }
                            : item
                        )
                      )
                    }
                    className="w-24 p-1 border rounded"
                  />

                  <button
                    onClick={() => atualizarProduto(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Atualizar
                  </button>
                  <button
                    onClick={() => excluirProduto(p.idProduto)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">Nenhum produto encontrado.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Produtos;
