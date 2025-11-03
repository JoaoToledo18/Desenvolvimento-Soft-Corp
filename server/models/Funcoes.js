import { getConnection } from "../db.js";

export async function getAllFuncoes() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(
      "SELECT idFuncao, nome, privilegios FROM funcoes"
    );
    await connection.end();
    return { success: true, funcoes: rows };
  } catch (err) {
    console.error("Erro ao buscar funções:", err.message);
    return { success: false, message: "Erro ao buscar funções." };
  }
}

export async function createFuncao({ nome, privilegios }) {
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "INSERT INTO funcoes (nome, privilegios) VALUES (?, ?)",
      [nome, privilegios]
    );
    await connection.end();
    return { success: true, id: result.insertId };
  } catch (err) {
    console.error("Erro ao criar função:", err.message);
    return { success: false, message: "Erro ao criar função." };
  }
}

export async function updateFuncao({ idFuncao, nome, privilegios }) {
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "UPDATE funcoes SET nome = ?, privilegios = ? WHERE idFuncao = ?",
      [nome, privilegios, idFuncao]
    );
    await connection.end();
    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Erro ao atualizar função:", err.message);
    return { success: false, message: "Erro ao atualizar função." };
  }
}

export async function deleteFuncao(idFuncao) {
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "DELETE FROM funcoes WHERE idFuncao = ?",
      [idFuncao]
    );
    await connection.end();
    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Erro ao excluir função:", err.message);
    return { success: false, message: "Erro ao excluir função." };
  }
}
