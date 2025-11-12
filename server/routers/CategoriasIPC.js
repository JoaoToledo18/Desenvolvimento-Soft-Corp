import { ipcMain } from "electron";
import {
  listarTodasCategorias,
  obterCategoriaPorId,
  criarCategoria,
  editarCategoria,
  removerCategoria,
} from "../controllers/CategoriasControllers.js";

// 📋 Listar todas as categorias ativas
ipcMain.handle("categorias:listar", async () => {
  return await listarTodasCategorias();
});

// 🔍 Buscar categoria por ID
ipcMain.handle("categorias:buscarPorId", async (event, id) => {
  return await obterCategoriaPorId(id);
});

// ➕ Criar nova categoria
ipcMain.handle("categorias:criar", async (event, nome) => {
  return await criarCategoria(nome);
});

// ✏️ Atualizar categoria existente
ipcMain.handle("categorias:editar", async (event, { id, nome }) => {
  return await editarCategoria(id, nome);
});

// ❌ Desativar (soft delete) categoria
ipcMain.handle("categorias:remover", async (event, id) => {
  return await removerCategoria(id);
});
