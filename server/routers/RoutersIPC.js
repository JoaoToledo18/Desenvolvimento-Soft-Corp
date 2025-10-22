import { ipcMain } from "electron";
import { login } from "../models/User.js"; 

ipcMain.handle("login", async (event, { usuario, senha }) => {
  return await login({ user: usuario, password: senha });
});

