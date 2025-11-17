import { getConnection } from "../db.js";

export async function buscar(filtros = {}) {
  const connection = await getConnection();
  try {
    let sql = `SELECT * FROM logs WHERE 1=1`;
    const params = [];

    if (filtros.usuarioSistema) {
      sql += ` AND usuarioSistema = ?`;
      params.push(filtros.usuarioSistema);
    }
    if (filtros.operacao) {
      sql += ` AND operacao = ?`;
      params.push(filtros.operacao);
    }
    if (filtros.dataInicio) {
      sql += ` AND dataOperacao >= ?`;
      params.push(filtros.dataInicio);
    }
    if (filtros.dataFim) {
      sql += ` AND dataOperacao <= ?`;
      params.push(filtros.dataFim);
    }

    sql += ` ORDER BY dataOperacao DESC`;

    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

export async function buscarPorId(idLog) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM logs WHERE idLog = ?`,
      [idLog]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Erro ao buscar log por ID:", error);
    throw error;
  } finally {
    await connection.end();
  }
}
