import { ipcMain } from "electron";
import { login } from "../models/User.js"; 
import { getUserTables } from "../models/Permissions.js";
import { getMaioresVendas } from "../models/MaioresVendas.js";

ipcMain.handle("login", async (event, { usuario, senha }) => {
  return await login({ user: usuario, password: senha });
});
ipcMain.handle("get-permissions", async () => {
  return await getUserTables();
});
ipcMain.handle("get-MaioresVendas", async () => {
  return await getMaioresVendas();
})
