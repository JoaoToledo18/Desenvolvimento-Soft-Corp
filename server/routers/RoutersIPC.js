import { ipcMain } from "electron";
import { login } from "../models/User.js";
import { getUserTables } from "../models/Permissions.js";
import { getMaioresVendas } from "../models/MaioresVendas.js";
import { 
  getAllProdutos, 
  createProduto, 
  updateProduto, 
  deleteProduto
} from "../models/Produtos.js";

import {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../models/Usuarios.js"
import {
  getAllFuncoes,
  createFuncao,
  updateFuncao,
  deleteFuncao
} from "../models/Funcoes.js";

ipcMain.handle("login", async (event, { usuario, senha }) => {
  return await login({ user: usuario, password: senha });
});

ipcMain.handle("get-permissions", async () => {
  return await getUserTables();
});

ipcMain.handle("get-MaioresVendas", async () => {
  return await getMaioresVendas();
});

ipcMain.handle("get-produtos", async () => {
  return await getAllProdutos();
});

ipcMain.handle("create-produto", async (event, { nome, categoria, preco }) => {
  return await createProduto({ nome, categoria, preco });
});

ipcMain.handle("update-produto", async (event, produto) => {
  return await updateProduto(produto);
});

ipcMain.handle("delete-produto", async (event, idProduto) => {
  return await deleteProduto(idProduto);
});

ipcMain.handle("get-usuarios", async () => {
  return await getAllUsuarios();
});

ipcMain.handle("create-usuario", async (event, usuario) => {
  return await createUsuario(usuario);
});

ipcMain.handle("update-usuario", async (event, usuario) => {
  return await updateUsuario(usuario);
});

ipcMain.handle("delete-usuario", async (event, idUsuario) => {
  return await deleteUsuario(idUsuario);
});

ipcMain.handle("get-funcoes", async () => {
  return await getAllFuncoes();
});

ipcMain.handle("create-funcao", async (event, { nome, privilegios }) => {
  return await createFuncao({ nome, privilegios });
});

ipcMain.handle("update-funcao", async (event, funcao) => {
  return await updateFuncao(funcao);
});

ipcMain.handle("delete-funcao", async (event, idFuncao) => {
  return await deleteFuncao(idFuncao);
});
