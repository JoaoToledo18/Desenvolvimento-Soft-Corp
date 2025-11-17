import React, { useEffect, useState } from "react";

export default function Pedidos({ permissoes, temaEscuro }) {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [cliente, setCliente] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visivelQtd, setVisivelQtd] = useState({});
  const [qtdInputs, setQtdInputs] = useState({});
  const podeCriar = permissoes?.insert ?? true;
  const podeEditar = permissoes?.update ?? true;
  const podeRemover = permissoes?.delete ?? true;
  const STATUSES = ["pendente", "pronto", "entregue", "pago", "cancelado"];

  useEffect(() => {
    carregar();
    carregarPedidos();
  }, []);

  async function carregar() {
    setLoading(true);
    try {
      const cats = await window.ipc.categorias.listar();
      const prods = await window.ipc.produtos.listar();
      setCategorias(
        cats?.success && Array.isArray(cats.data)
          ? cats.data
          : Array.isArray(cats)
          ? cats
          : []
      );
      setProdutos(
        prods?.success && Array.isArray(prods.data)
          ? prods.data
          : Array.isArray(prods)
          ? prods
          : []
      );
      setCategoriaAtiva(
        (cats?.success && cats.data?.[0]?.idCategorias) ||
          cats?.[0]?.idCategorias ||
          null
      );
    } catch (err) {
      setCategorias([]);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }

  async function carregarPedidos() {
    try {
      const res = await window.ipc.vendas.listar();
      if (res?.success && Array.isArray(res.data)) setPedidos(res.data);
      else if (Array.isArray(res)) setPedidos(res);
      else setPedidos([]);
    } catch (err) {
      setPedidos([]);
    }
  }

  const produtosFiltrados = produtos.filter(
    (p) => p.categorias_idCategorias === categoriaAtiva
  );

  function abrirQuantidade(prod) {
    setVisivelQtd((s) => ({ ...s, [prod.idProdutos]: !s[prod.idProdutos] }));
    setQtdInputs((s) => ({ ...s, [prod.idProdutos]: s[prod.idProdutos] ?? 1 }));
  }

  function alterarInputQtd(prodId, val) {
    const v = Number(val);
    if (!Number.isFinite(v) || v < 1) return;
    setQtdInputs((s) => ({ ...s, [prodId]: Math.floor(v) }));
  }

  function adicionarAoCarrinho(prod) {
    const qtd = Number(qtdInputs[prod.idProdutos] ?? 1);
    if (!qtd || qtd <= 0) return;
    setCarrinho((old) => {
      const idx = old.findIndex((i) => i.produtoId === prod.idProdutos);
      if (idx >= 0) {
        const copia = [...old];
        copia[idx].quantidade = Number(copia[idx].quantidade) + qtd;
        copia[idx].subtotal =
          Number(copia[idx].quantidade) * Number(copia[idx].preco);
        return copia;
      }
      return [
        ...old,
        {
          produtoId: prod.idProdutos,
          nome: prod.nome,
          preco: Number(prod.preco),
          quantidade: qtd,
          subtotal: Number(prod.preco) * qtd,
        },
      ];
    });
    setVisivelQtd((s) => ({ ...s, [prod.idProdutos]: false }));
  }

  function removerItem(produtoId) {
    setCarrinho((old) => old.filter((i) => i.produtoId !== produtoId));
  }

  function mudarQtd(produtoId) {
    const item = carrinho.find((i) => i.produtoId === produtoId);
    if (!item) return;
    const nova = prompt("Nova quantidade:", String(item.quantidade));
    if (nova === null) return;
    const qtd = Number(nova);
    if (!qtd || qtd <= 0) return;
    setCarrinho((old) =>
      old.map((i) =>
        i.produtoId === produtoId
          ? { ...i, quantidade: qtd, subtotal: qtd * i.preco }
          : i
      )
    );
  }

  const total = carrinho.reduce((s, it) => s + Number(it.subtotal), 0);

  async function confirmarPedido() {
    if (!podeCriar) {
      alert("Sem permissão para criar pedidos.");
      return;
    }
    if (!cliente || cliente.trim().length === 0) {
      alert("Informe o nome do cliente.");
      return;
    }
    if (carrinho.length === 0) {
      alert("Adicione itens ao pedido.");
      return;
    }
    const itens = carrinho.map((i) => ({
      produtoId: i.produtoId,
      quantidade: i.quantidade,
    }));
    try {
      const usuarioId = null;
      const res = await window.ipc.vendas.registrar(
        cliente.trim(),
        usuarioId,
        itens
      );
      if (res?.success) {
        setCliente("");
        setCarrinho([]);
        carregarPedidos();
      } else {
        carregarPedidos();
      }
    } catch (err) {
      alert("Erro ao criar pedido.");
    }
  }

  async function alterarStatus(id, novoStatus) {
    if (!podeEditar) {
      alert("Sem permissão.");
      return;
    }
    try {
      const res = await window.ipc.vendas.atualizarStatus(id, novoStatus);
      if (res?.success) carregarPedidos();
    } catch (err) {}
  }

  async function verItens(p) {
    try {
      const id = p.idVendas ?? p.id ?? p.idVenda;
      const res = await window.ipc.vendas.buscarPorId(id);
      const data = res?.success ? res.data : res;
      const itens = data?.itens ?? [];
      const txt = itens
        .map(
          (it) =>
            `${it.produto_nome ?? "Produto"} — qtd:${it.quantidade} — R$ ${(
              Number(it.precoUnitario) ||
              Number(it.preco) ||
              0
            ).toFixed(2)}`
        )
        .join("\n");
      alert(txt || "Sem itens.");
    } catch (err) {
      alert("Erro ao obter itens");
    }
  }

  function formatPrice(v) {
    return `R$ ${Number(v).toFixed(2)}`;
  }

  return (
    <div
      className={`p-6 space-y-6 ${temaEscuro ? "bg-gray-900 text-white" : ""}`}
    >
      <h2 className="text-2xl font-bold">Pedidos</h2>

      <div className="bg-white rounded shadow p-4">
        <div className="flex gap-3 mb-4">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Nome do cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={confirmarPedido}
          >
            Concluir Pedido ({formatPrice(total)})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="mb-3">
              <div className="flex gap-2 overflow-x-auto">
                {categorias.map((c) => (
                  <button
                    key={c.idCategorias}
                    onClick={() => setCategoriaAtiva(c.idCategorias)}
                    className={`px-3 py-1 rounded ${
                      categoriaAtiva === c.idCategorias
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {c.nome}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading ? (
                <div>Carregando...</div>
              ) : produtosFiltrados.length ? (
                produtosFiltrados.map((p) => (
                  <div
                    key={p.idProdutos}
                    className="bg-gray-50 p-3 rounded shadow flex flex-col"
                  >
                    <div className="font-semibold">{p.nome}</div>
                    <div className="text-sm mb-2">{formatPrice(p.preco)}</div>
                    <div className="mt-auto flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => abrirQuantidade(p)}
                      >
                        + Adicionar
                      </button>
                      <button
                        className="bg-gray-200 px-2 py-1 rounded"
                        onClick={() => {
                          setVisivelQtd((s) => ({
                            ...s,
                            [p.idProdutos]: true,
                          }));
                          setQtdInputs((s) => ({
                            ...s,
                            [p.idProdutos]: s[p.idProdutos] ?? 1,
                          }));
                        }}
                      >
                        Qtd
                      </button>
                    </div>
                    {visivelQtd[p.idProdutos] && (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={qtdInputs[p.idProdutos] ?? 1}
                          onChange={(e) =>
                            alterarInputQtd(p.idProdutos, e.target.value)
                          }
                          className="border p-1 rounded w-20"
                        />
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => adicionarAoCarrinho(p)}
                        >
                          Adicionar
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={() =>
                            setVisivelQtd((s) => ({
                              ...s,
                              [p.idProdutos]: false,
                            }))
                          }
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full italic text-gray-500">
                  Nenhum produto nesta categoria.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-bold mb-2">Comanda</h3>
            {carrinho.length === 0 ? (
              <div className="italic text-gray-500">Sem itens.</div>
            ) : (
              <div className="space-y-2">
                {carrinho.map((it) => (
                  <div
                    key={it.produtoId}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <div>
                      <div className="font-semibold">{it.nome}</div>
                      <div className="text-sm">
                        {formatPrice(it.preco)} x {it.quantidade}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-semibold">
                        {formatPrice(it.subtotal)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => mudarQtd(it.produtoId)}
                          className="px-2 py-1 bg-yellow-300 rounded text-sm"
                        >
                          Qtd
                        </button>
                        <button
                          onClick={() => removerItem(it.produtoId)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Rem
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-bold mb-3">Pedidos</h3>

        <div className="space-y-2">
          {pedidos.length === 0 ? (
            <div className="italic text-gray-500">Nenhum pedido.</div>
          ) : (
            pedidos.map((p) => {
              const id = p.idVendas ?? p.id ?? p.idVenda;
              const nomePedido = p.nome ?? p.nomeCliente ?? p.nome;
              const status = (p.status ?? "").toLowerCase();
              const data = p.dataVenda;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-semibold">
                      #{id} — {nomePedido}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data
                        ? new Date(data).toLocaleString("pt-BR")
                        : "Sem data"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => alterarStatus(id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => verItens(p)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Itens
                    </button>

                    {podeRemover && (
                      <button
                        onClick={() => {
                          if (!confirm("Cancelar este pedido?")) return;
                          alterarStatus(id, "cancelado");
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
