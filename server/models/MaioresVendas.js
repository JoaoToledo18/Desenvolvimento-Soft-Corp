import { getConnection } from "../db.js";

export async function getMaioresVendas() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query("");

    await connection.end();

    const vendas = rows.map((row) => row[Object.keys(row)]);

    return { success: true, vendas };
  } catch (err) {
    console.error("Erro ao buscar tabelas:", err.message);
    return { success: false, message: "Erro ao buscar tabelas." };
  }
}
