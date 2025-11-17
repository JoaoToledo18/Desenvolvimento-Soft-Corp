import React, { useEffect, useState } from "react";

export default function Vendas({ permissoes, temaEscuro }) {
  const podeRemover = permissoes?.delete ?? true;

  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarVendas();
  }, []);

  async function carregarVendas() {
    setCarregando(true);
    try {
      const res = await window.ipc.vendasAdmin.listar();
      const data = res?.success ? res.data : Array.isArray(res) ? res : [];
      setVendas(data);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
      setVendas([]);
    } finally {
      setCarregando(false);
    }
  }

  async function excluirVenda(id) {
    if (!podeRemover) return alert("Sem permissão!");
    if (!confirm("Excluir venda permanentemente?")) return;

    const res = await window.ipc.vendasAdmin.remover(id);
    if (res?.success) carregarVendas();
  }

  function formatDate(d) {
    return d ? new Date(d).toLocaleString("pt-BR") : "Sem data";
  }

  return (
    <div
      className={`p-6 space-y-6 ${temaEscuro ? "bg-gray-900 text-white" : ""}`}
    >
      <h2 className="text-2xl font-bold">Histórico de Vendas</h2>

      <div
        className={`rounded shadow p-4 overflow-auto ${
          temaEscuro ? "bg-gray-800" : "bg-white"
        }`}
      >
        {carregando ? (
          <p>Carregando...</p>
        ) : vendas.length === 0 ? (
          <p className="italic text-gray-500">Nenhuma venda registrada.</p>
        ) : (
          vendas.map((v) => {
            const id = v.idVendas ?? v.id;

            return (
              <div
                key={id}
                className="border-b border-gray-300 p-3 mb-4 rounded"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Venda #{id}</p>
                    <p>
                      Cliente: <strong>{v.nome ?? "Não informado"}</strong>
                    </p>
                    <p>Data: {formatDate(v.dataVenda)}</p>
                  </div>

                  {podeRemover && (
                    <button
                      onClick={() => excluirVenda(id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  )}
                </div>

                <div className="mt-3 pl-3 border-l-4 border-blue-500">
                  {v.itens?.length > 0 ? (
                    v.itens.map((item, i) => (
                      <div key={i} className="text-sm flex justify-between">
                        <span>
                          {item.nome} — {item.quantidade}x
                        </span>
                        <span>
                          R${" "}
                          {(
                            Number(item.preco) * Number(item.quantidade)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Nenhum item listado
                    </p>
                  )}
                </div>

                <p className="mt-3 font-bold">
                  Total: R$ {(v.totalVenda ?? 0).toFixed(2)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
