import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {
  // 🔹 Login
  login: async (usuario, senha) => {
    const resposta = await ipcRenderer.invoke("login", { usuario, senha });
    return resposta;
  },

  // 🔹 Permissões
  getPermissions: async () => {
    return await ipcRenderer.invoke("get-permissions");
  },

  // 🔹 Maiores vendas
  getMaioresVendas: async () => {
    return await ipcRenderer.invoke("get-MaioresVendas");
  },

  getProdutos: async () => await ipcRenderer.invoke("get-produtos"),
  createProduto: async (nome, categoria, preco) =>
    await ipcRenderer.invoke("create-produto", { nome, categoria, preco }),
  updateProduto: async (produto) =>
    await ipcRenderer.invoke("update-produto", produto),
  deleteProduto: async (idProduto) =>
    await ipcRenderer.invoke("delete-produto", idProduto),
});
