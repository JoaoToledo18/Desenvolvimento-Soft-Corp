const { ipcMain } = require("electron");
const LoginController = require("../controllers/Login");

// Canal de login
ipcMain.handle("login", async (event, { usuario, senha }) => {
  const resultado = await LoginController.login(usuario, senha);
  return resultado;
});