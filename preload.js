import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {

  login: async (usuario, senha) => {
    return await ipcRenderer.invoke("login", { usuario, senha });
  },

  getPermissions: async () => {
    return await ipcRenderer.invoke("get-permissions");
  },

  getMaioresVendas: async () => {
    return await ipcRenderer.invoke("get-MaioresVendas");
  },

  getProdutos: async () => {
    return await ipcRenderer.invoke("get-produtos");
  },

  createProduto: async (nome, categoria, preco) => {
    return await ipcRenderer.invoke("create-produto", { nome, categoria, preco });
  },

  updateProduto: async (produto) => {
    return await ipcRenderer.invoke("update-produto", produto);
  },

  deleteProduto: async (idProduto) => {
    return await ipcRenderer.invoke("delete-produto", idProduto);
  },

  getUsuarios: async () => {
    return await ipcRenderer.invoke("get-usuarios");
  },

  createUsuario: async ({ nome, login, senha, idFuncao }) => {
    return await ipcRenderer.invoke("create-usuario", { nome, login, senha, idFuncao });
  },

  updateUsuario: async (usuario) => {
    return await ipcRenderer.invoke("update-usuario", usuario);
  },

  deleteUsuario: async (idUsuario) => {
    return await ipcRenderer.invoke("delete-usuario", idUsuario);
  },

  getFuncoes: async () => {
    return await ipcRenderer.invoke("get-funcoes");
  },

  createFuncao: async (nome, privilegios) => {
    return await ipcRenderer.invoke("create-funcao", { nome, privilegios });
  },

  updateFuncao: async (funcao) => {
    return await ipcRenderer.invoke("update-funcao", funcao);
  },

  deleteFuncao: async (idFuncao) => {
    return await ipcRenderer.invoke("delete-funcao", idFuncao);
  },

});
