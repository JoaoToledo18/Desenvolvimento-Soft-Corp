import { ipcMain } from "electron";
import { login } from "../models/User.js"; 
import { getUserTables } from "../models/Permissions.js";
import { getMaioresVendas } from "../models/MaioresVendas.js";
import { 
  getAllProdutos, 
  createProduto, 
  updateProduto, 
  deleteProduto,
} from "../models/Produtos.js";
import { createFuncionario, getAllFuncionarios, deleteFuncionario, updateFuncionario, getFuncoes} from "../models/Funcionario.js";

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

ipcMain.handle("get-funcionarios", async () =>{
  return await getAllFuncionarios()
});

ipcMain.handle("create-funcionario", async (event, { nome, login, senha, idFuncoes }) => {
  return await createFuncionario({ nome, login, senha, idFuncoes });
});

ipcMain.handle("update-funcionario", async (event, { nome, login, senha, idFuncionario }) => {
  return await updateFuncionario({ nome, login, senha, idFuncionario });
});

ipcMain.handle("delete-funcionario", async (event, idFuncionario) => {
  return await deleteFuncionario(idFuncionario);
});

ipcMain.handle("get-funcoes", async () => {
    return await getFuncoes();
})