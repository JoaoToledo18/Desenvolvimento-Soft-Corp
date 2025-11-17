import {getConnection} from "../db.js";

export async function listarCategorias() {
  const connection = await getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM categorias WHERE ativo = 1"
  );
  await connection.end();
  return rows;
}

export async function buscarCategoriaPorId(id) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM categorias WHERE idCategorias = ?",
    [id]
  );
  await connection.end();
  return rows[0];
}

export async function adicionarCategoria(nome) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "INSERT INTO categorias (nome, ativo) VALUES (?, 1)",
    [nome]
  );
  await connection.end();
  return result.insertId;
}

export async function atualizarCategoria(id, nome) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "UPDATE categorias SET nome = ? WHERE idCategorias = ?",
    [nome, id]
  );
  await connection.end();
  return result.affectedRows > 0;
}

export async function desativarCategoria(id) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "UPDATE categorias SET ativo = 0 WHERE idCategorias = ?",
    [id]
  );
  await connection.end();
  return result.affectedRows > 0;
}
