import React, { useState, useEffect } from "react";

export default function Historico({ permissoes }) {
  const [filtros, setFiltros] = useState({
    usuarioSistema: "",
    operacao: "",
    dataInicio: "",
    dataFim: "",
  });
  const [logs, setLogs] = useState([]);

  const podeVisualizar = permissoes?.select || false;

  useEffect(() => {
    carregarLogs();
  }, []);

  async function carregarLogs() {
    if (!podeVisualizar) return;
    try {
      const res = await window.ipc.historico.listar(filtros);
      setLogs(res?.success && Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setLogs([]);
    }
  }

  function handleFiltroChange(e) {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  }

  async function aplicarFiltros(e) {
    e.preventDefault();
    await carregarLogs();
  }

  async function limparFiltros() {
    setFiltros({
      usuarioSistema: "",
      operacao: "",
      dataInicio: "",
      dataFim: "",
    });
    await carregarLogs();
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Histórico de Operações</h2>

      <form
        onSubmit={aplicarFiltros}
        className="bg-white shadow-md rounded p-4 flex flex-col gap-3"
      >
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Usuário"
            name="usuarioSistema"
            value={filtros.usuarioSistema}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Operação"
            name="operacao"
            value={filtros.operacao}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="dataInicio"
            value={filtros.dataInicio}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="dataFim"
            value={filtros.dataFim}
            onChange={handleFiltroChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={limparFiltros}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Limpar Filtros
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Tabela</th>
              <th className="p-2 text-left">Operação</th>
              <th className="p-2 text-left">ID Registro</th>
              <th className="p-2 text-left">Valores Antigos</th>
              <th className="p-2 text-left">Valores Novos</th>
              <th className="p-2 text-left">Usuário</th>
              <th className="p-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.idLog} className="border-b">
                  <td className="p-2">{log.idLog}</td>
                  <td className="p-2">{log.tabela}</td>
                  <td className="p-2">{log.operacao}</td>
                  <td className="p-2">{log.registroId}</td>
                  <td className="p-2">
                    <pre className="whitespace-pre-wrap">
                      {log.valoresAntigos}
                    </pre>
                  </td>
                  <td className="p-2">
                    <pre className="whitespace-pre-wrap">
                      {log.valoresNovos}
                    </pre>
                  </td>
                  <td className="p-2">{log.usuarioSistema}</td>
                  <td className="p-2">
                    {new Date(log.dataOperacao).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-4 italic text-gray-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
