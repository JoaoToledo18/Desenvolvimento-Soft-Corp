import { getConnection } from "../db.js";

export async function getUserTables() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query("SHOW TABLES");

    await connection.end();

    const tables = rows.map((row) => row[Object.keys(row)[0]]);

    return { success: true, tables };
  } catch (err) {
    console.error("Erro ao buscar tabelas:", err.message);
    return { success: false, message: "Erro ao buscar tabelas." };
  }
}
