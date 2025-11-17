import React, { useState, useEffect } from "react";

export default function Usuarios({ permissoes }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await window.ipc.usuarios.listar();
      if (res.success && Array.isArray(res.data)) {
        setUsuarios(res.data);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setUsuarios([]);
    }
  }

  async function togglePermissao(idUsuario, idPermissao, tipoPerm, valorAtual) {
    const res = await window.ipc.usuarios.alterarPermissoes({
      idUsuario,
      idPermissao,
      permissoes: { [tipoPerm]: valorAtual ? 0 : 1 },
    });

    console.log("Resposta atualização perm:", res);
    carregarUsuarios();
  }

  async function handleExcluir(idUsuario) {
    await window.ipc.usuarios.remover(idUsuario);
    carregarUsuarios();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-[#18181B] text-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Usuários do Sistema</h2>

        {usuarios.length === 0 ? (
          <p className="text-center p-4 italic text-gray-400">
            Nenhum usuário encontrado.
          </p>
        ) : (
          usuarios.map((u) => (
            <div key={u.idUsuario} className="mb-8 bg-[#27272A] rounded-lg p-4">
              {/* Cabeçalho do card */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {u.nome}{" "}
                  <span className="text-gray-400">({u.login})</span>
                </h3>

                {permissoes.delete && (
                  <button
                    onClick={() => handleExcluir(u.idUsuario)}
                    className="bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded text-sm"
                  >
                    Desativar
                  </button>
                )}
              </div>

              {/* Permissões */}
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">
                  <thead className="bg-[#3F3F46] text-white">
                    <tr>
                      <th className="p-2 text-left">Módulo</th>
                      <th className="p-2">Select</th>
                      <th className="p-2">Insert</th>
                      <th className="p-2">Update</th>
                      <th className="p-2">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(u.permissoes).map(([modulo, perms]) => (
                      <tr
                        key={`${u.idUsuario}-${modulo}`}
                        className="border-b border-[#3F3F46] hover:bg-[#323235]"
                      >
                        <td className="p-2 text-left font-medium capitalize">
                          {modulo}
                        </td>

                        {["select", "insert", "update", "delete"].map((p) => (
                          <td key={`${modulo}-${p}`} className="p-2">
                            <button
                              disabled={!permissoes.update}
                              onClick={() =>
                                togglePermissao(
                                  u.idUsuario,
                                  perms.idPermissao,
                                  p,
                                  perms[p]
                                )
                              }
                              className={`w-8 h-8 rounded-full transition ${
                                perms[p]
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-red-500 hover:bg-red-600"
                              } ${
                                !permissoes.update &&
                                "opacity-40 cursor-not-allowed"
                              }`}
                            >
                              {perms[p] ? "✔" : "✘"}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
