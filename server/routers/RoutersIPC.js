import { ipcMain } from "electron";
import { login } from "../models/User.js"; 
import { getUserTables } from "../models/Permissions.js";

ipcMain.handle("login", async (event, { usuario, senha }) => {
  return await login({ user: usuario, password: senha });
});
ipcMain.handle("get-permissions", async () => {
  return await getUserTables();
});

