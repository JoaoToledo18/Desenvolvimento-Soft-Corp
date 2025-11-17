import { ipcMain } from "electron";
import {
  listarUsuarios,
  criarNovoUsuario,
  alterarPermissoesUsuario,
  removerUsuario,
} from "../controllers/UsuariosController.js";

// Listar usuários com suas permissões
ipcMain.handle("usuarios:listar", async () => {
  return await listarUsuarios();
});

// Criar usuário
ipcMain.handle(
  "usuarios:criar",
  async (event, { login, senha }) => {
    return await criarNovoUsuario(login, senha);
  }
);

// Alterar permissões de um usuário (recebe objeto permissoes)
ipcMain.handle(
  "usuarios:alterarPermissoes",
  async (event, { idUsuario, idPermissao, permissoes }) => {
    // passa exatamente o que o front envia
    return await alterarPermissoesUsuario(idUsuario, idPermissao, permissoes);
  }
);

// Desativar usuário (ativo = 0)
ipcMain.handle("usuarios:remover", async (event, idUsuario) => {
  return await removerUsuario(idUsuario);
});
