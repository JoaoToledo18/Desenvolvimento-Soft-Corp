import { ipcMain } from "electron";
import { listar, atualizar, criar } from "../controllers/UsuariosController.js";

// 🔹 Listar usuários + permissões
ipcMain.handle("usuarios:listar", async () => {
  return await listar();
});

// 🔹 Atualizar permissões
ipcMain.handle(
  "usuarios:alterarPermissoes",
  async (event, { idUsuario, permissoes }) => {
    return await atualizar(idUsuario, permissoes);
  }
);

// 🔹 Criar usuário (sistema + MySQL)
ipcMain.handle("usuarios:criar", async (event, dadosUsuario) => {
  return await criar(dadosUsuario);
});
