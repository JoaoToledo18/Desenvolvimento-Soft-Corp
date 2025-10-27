import { getConnection } from "../db.js";

export async function getMaioresVendas() {
  try {
    const connection = await getConnection();

    // Ajuste sua query conforme as colunas reais da tabela
    const [rows] = await connection.query("SELECT produto, totalVendida FROM siscorp.qtdvenda ORDER BY totalVendida DESC;");

    await connection.end();

    // Agora o resultado vem corretamente

    console.log(rows)
    return { success: true, vendas: rows };
  } catch (err) {
    console.error("Erro ao buscar vendas:", err.message);
    return { success: false, message: "Erro ao buscar vendas." };
  }
}
