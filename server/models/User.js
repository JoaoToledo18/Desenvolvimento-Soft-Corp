import { conn } from "../db.js";

export async function login({ user, password }) {
  const resultado = await conn({ user, password });

  if (resultado.success) {
    return { success: true, message: "Login realizado com sucesso!" };
  } else {
    return { success: false, message: "Usuário ou senha incorretos." };
  }
}