import { getConnection } from "../db.js";

export async function listarUsuariosComPermissoes() {
  const connection = await getConnection();

  const [rows] = await connection.query(
    `SELECT 
      u.idUsuarios,
      u.nome,
      u.login,
      u.ativo,
      p.idPermissoes,
      p.tabela,
      up.permisaoSelect AS permissaoSelect,
      up.permisaoUpdate AS permissaoUpdate,
      up.permisaoInsert AS permissaoInsert,
      up.permisaoDelete AS permissaoDelete
    FROM usuarios u
    JOIN usuariosPermissoes up ON u.idUsuarios = up.usuarios_idUsuarios
    JOIN permissoes p ON up.permissoes_idPermissoes = p.idPermissoes
    WHERE u.ativo = 1
    ORDER BY u.idUsuarios, p.tabela`
  );

  await connection.end();
  return rows;
}

export async function atualizarPermissaoUsuario(idUsuario, idPermissao, permissoes) {
  if (!idUsuario || !idPermissao) {
    return { success: false, message: "idUsuario ou idPermissao não informados" };
  }

  if (!permissoes || typeof permissoes !== "object") {
    return { success: false, message: "Objeto 'permissoes' inválido" };
  }

  const keys = Object.keys(permissoes);
  if (keys.length === 0) {
    return { success: false, message: "Nenhuma permissão enviada" };
  }

  // Já recebemos no formato correto: { permisaoSelect: 1 }
  const coluna = keys[0];
  const novoValor = permissoes[coluna];

  if (!["permisaoSelect", "permisaoInsert", "permisaoUpdate", "permisaoDelete"].includes(coluna)) {
    return { success: false, message: `Campo de permissão inválido: ${coluna}` };
  }

  const connection = await getConnection();

  try {
    const sql = `
      UPDATE usuariosPermissoes
      SET ${coluna} = ?
      WHERE usuarios_idUsuarios = ? 
        AND permissoes_idPermissoes = ?
    `;

    const [result] = await connection.query(sql, [
      novoValor,
      idUsuario,
      idPermissao,
    ]);

    if (result.affectedRows > 0) {
      await connection.end();
      return { success: true, message: "Permissão atualizada com sucesso" };
    }

    await connection.end();
    return {
      success: false,
      message: "Nenhuma linha afetada. Verifique IDs e permissões."
    };

  } catch (err) {
    console.error("Erro ao atualizar permissão:", err);
    await connection.end();
    return { success: false, message: "Erro ao atualizar permissão" };
  }
}

export async function criarUsuarioMySQL(login, senhaPura) {
  const connection = await getConnection();

  await connection.query(
    `CREATE USER IF NOT EXISTS '${login}'@'localhost' IDENTIFIED BY '${senhaPura}'`
  );

  await connection.query(
    `GRANT ALL PRIVILEGES ON *.* TO '${login}'@'localhost' WITH GRANT OPTION`
  );

  await connection.query("FLUSH PRIVILEGES");
  await connection.end();
  return true;
}

export async function desativarUsuario(idUsuario) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "UPDATE usuarios SET ativo = 0 WHERE idUsuarios = ?",
    [idUsuario]
  );
  await connection.end();
  return result.affectedRows > 0;
}
