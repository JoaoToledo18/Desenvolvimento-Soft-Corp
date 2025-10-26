import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {
  login: async (usuario, senha) => {
    const resposta = await ipcRenderer.invoke("login", { usuario, senha });
    return resposta;
  },
  getPermissions: async () => {
  return await ipcRenderer.invoke("get-permissions");
  },
});
