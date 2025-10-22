import mysql from "mysql2/promise";

// utilizar .env futuramente
const HOST = "localhost";
const DATABASE = "hamburgueria";

export async function conn({ user, password }) {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      user,
      password,
      database: DATABASE,
    });

    await connection.ping();
    await connection.end();
    return { success: true };
  } catch (error) {
    console.error("Erro de conexão:", error.message);
    return { success: false, error: error.message };
  }
}
