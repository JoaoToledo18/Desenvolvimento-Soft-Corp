import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

let lastCredentials = null;
let idUser = null;

export async function conn({ user, password }) {
  try {
    const connection = await mysql.createConnection({
      host: "mysql-1d9027ca-joaotoledo-bd.e.aivencloud.com",
      user,
      password,
      port: "13231",
      database: "hamburgueria",
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
    host: "mysql-1d9027ca-joaotoledo-bd.e.aivencloud.com",
    user: creds.user,
    password: creds.password,
    port: "13231",
    database: "hamburgueria",
  });
}
