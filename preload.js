const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  login: async (usuario, senha) => {
    const resposta = await ipcRenderer.invoke("login", { usuario, senha });
    return resposta;
  },
});