import mysql from "mysql2/promise";

const HOST = "localhost";
const DATABASE = "hamburgueria";

let lastCredentials = null;

export async function conn({ user, password }) {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      user,
      password,
      database: DATABASE,
    });

    await connection.ping();
    lastCredentials = { user, password };
    await connection.end();

    return { success: true };
  } catch (error) {
    console.error("Erro de conexão:", error.message);
    return { success: false, error: error.message };
  }
}

export function getLastCredentials() {
  return lastCredentials;
}

export async function getConnection() {
  const creds = getLastCredentials();
  if (!creds) throw new Error("Nenhum usuário logado.");

  return await mysql.createConnection({
    host: HOST,
    user: creds.user,
    password: creds.password,
    database: DATABASE,
  });
}
