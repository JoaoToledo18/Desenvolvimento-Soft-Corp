import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

let lastCredentials = null;
let idUser = null;

export async function conn({ user, password }) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user,
      password,
      port: process.env.PORT,
      database: process.env.DATABASE,
    });

    await connection.ping();

    lastCredentials = { user, password };

    const [rows] = await connection.query(
      "SELECT idUsuarios FROM usuarios WHERE login = ?",
      [user]
    );

    idUser = rows.length > 0 ? rows[0].idUsuarios : null;

    await connection.end();

    return { success: true, idUser };
  } catch (error) {
    console.error("Erro de conexão:", error.message);
    return { success: false, error: error.message };
  }
}

export function getLastCredentials() {
  return lastCredentials;
}

export function getIdUser() {
  return idUser;
}

export async function getConnection() {
  const creds = getLastCredentials();
  if (!creds) throw new Error("Nenhum usuário logado.");

  return await mysql.createConnection({
    host: process.env.HOST,
    user: creds.user,
    password: creds.password,
    port: process.env.PORT,
    database: process.env.DATABASE,
  });
}
