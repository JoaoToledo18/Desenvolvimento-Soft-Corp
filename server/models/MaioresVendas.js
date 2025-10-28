import { getConnection } from "../db.js";

export async function getMaioresVendas() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query("select * from  qtdvenda;");

    await connection.end();

    return { success: true, vendas: rows };
  } catch (err) {
    console.error("Erro ao buscar vendas:", err.message);
    return { success: false, message: "Erro ao buscar vendas." };
  }
}
