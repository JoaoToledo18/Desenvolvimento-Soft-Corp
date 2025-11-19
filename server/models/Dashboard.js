import { getConnection } from "../db.js";

export async function listarCategoriaVenda() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM vwCategoriaVenda");
  await connection.end();
  return rows;
}

export async function listarQuantidadeVenda() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM vwQuantidadeVenda");
  await connection.end();
  return rows;
}

export async function listarVendaMes() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM vwVendaMes");
  await connection.end();
  return rows;
}

export async function listarVendaUsuario() {
  const connection = await getConnection();
  const [rows] = await connection.query("SELECT * FROM vwVendaUsuario");
  await connection.end();
  return rows;
}

export async function listarVendaUsuarioPorMes(mesAno) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM vwVendaUsuario WHERE mesAno = ?",
    [mesAno]
  );
  await connection.end();
  return rows;
}
