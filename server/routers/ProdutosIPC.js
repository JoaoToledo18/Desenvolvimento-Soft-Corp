import { ipcMain } from "electron";
import {
  listarTodosProdutos,
  obterProdutoPorId,
  criarProduto,
  editarProduto,
  removerProduto,
} from "../controllers/ProdutosController.js";

// 📋 Listar produtos
ipcMain.handle("produtos:listar", async () => {
  return await listarTodosProdutos();
});

// 🔍 Buscar produto por ID
ipcMain.handle("produtos:buscarPorId", async (event, id) => {
  return await obterProdutoPorId(id);
});

// ➕ Criar novo produto
ipcMain.handle("produtos:criar", async (event, { nome, preco, categoriaId }) => {
  return await criarProduto(nome, preco, categoriaId);
});

// ✏️ Atualizar produto
ipcMain.handle("produtos:editar", async (event, { id, nome, preco, categoriaId }) => {
  return await editarProduto(id, nome, preco, categoriaId);
});

// ❌ Desativar produto (soft delete)
ipcMain.handle("produtos:remover", async (event, id) => {
  return await removerProduto(id);
});
