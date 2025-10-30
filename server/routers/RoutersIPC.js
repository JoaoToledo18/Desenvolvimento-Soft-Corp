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

// 🔹 Login
ipcMain.handle("login", async (event, { usuario, senha }) => {
  return await login({ user: usuario, password: senha });
});

// 🔹 Permissões
ipcMain.handle("get-permissions", async () => {
  return await getUserTables();
});

// 🔹 Maiores vendas
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