import { getConnection, getIdUser } from "../db.js";

export async function buscarPermissoesDoBanco() {
  const connection = await getConnection();
  const id = getIdUser();

  if (!id) {
    throw new Error("Usuário não está logado ou ID não encontrado.");
  }

  const [rows] = await connection.query(
    `
    SELECT 
      p.tabela AS nome_tabela,
      up.permisaoSelect,
      up.permisaoInsert,
      up.permisaoUpdate,
      up.permisaoDelete
    FROM 
      usuariosPermissoes up
    INNER JOIN 
      permissoes p 
        ON p.idPermissoes = up.permissoes_idPermissoes
    WHERE 
      up.usuarios_idUsuarios = ?;
    `,
    [id]
  );

  await connection.end();
  return rows;
}
