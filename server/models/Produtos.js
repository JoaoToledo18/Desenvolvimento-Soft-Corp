import { getConnection } from "../db.js";

export async function getAllProdutos() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query(
      "SELECT idProduto, nome, categoria, preco FROM produtos"
    );

    await connection.end();
    return { success: true, produtos: rows };
  } catch (err) {
    console.error("Erro ao buscar produtos:", err.message);
    return { success: false, message: "Erro ao buscar produtos." };
  }
}

export async function createProduto({ nome, categoria, preco }) {
  try {
    const connection = await getConnection();

    const [result] = await connection.query(
      "INSERT INTO produtos (nome, categoria, preco) VALUES (?, ?, ?)",
      [nome, categoria, preco]
    );

    await connection.end();
    return { success: true, id: result.insertId };
  } catch (err) {
    console.error("Erro ao criar produto:", err.message);
    return { success: false, message: "Erro ao criar produto." };
  }
}

export async function updateProduto({ idProduto, nome, categoria, preco }) {
  try {
    const connection = await getConnection();

    const [result] = await connection.query(
      "UPDATE produtos SET nome = ?, categoria = ?, preco = ? WHERE idProduto = ?",
      [nome, categoria, preco, idProduto]
    );

    await connection.end();
    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Erro ao atualizar produto:", err.message);
    return { success: false, message: "Erro ao atualizar produto." };
  }
}

export async function deleteProduto(idProduto) {
  try {
    const connection = await getConnection();

    const [result] = await connection.query(
      "DELETE FROM produtos WHERE idProduto = ?",
      [idProduto]
    );

    await connection.end();
    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Erro ao excluir produto:", err.message);
    return { success: false, message: "Erro ao excluir produto." };
  }
}
