import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {

  login: async (usuario, senha) => {
    const resposta = await ipcRenderer.invoke("login", { usuario, senha });
    return resposta;
  },

  getPermissions: async () => {
    return await ipcRenderer.invoke("get-permissions");
  },

  getMaioresVendas: async () => {
    return await ipcRenderer.invoke("get-MaioresVendas");
  },

  getProdutos: async () => {
    return await ipcRenderer.invoke("get-produtos")
  },

  createProduto: async (nome, categoria, preco) => {
    return await ipcRenderer.invoke("create-produto", { nome, categoria, preco })
  },
    
  updateProduto: async (produto) => {
    return await ipcRenderer.invoke("update-produto", produto)
  },

  deleteProduto: async (idProduto) => {
    return await ipcRenderer.invoke("delete-produto", idProduto)
  },
});
