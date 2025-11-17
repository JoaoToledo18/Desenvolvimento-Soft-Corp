import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import "./server/routers/authIPC.js";
import "./server/routers/CategoriasIPC.js";
import "./server/routers/ProdutosIPC.js";
import "./server/routers/PedidosIPC.js";
import "./server/routers/VendasIPC.js";
import "./server/routers/HistoricoIPC.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const isDev = !app.isPackaged;
  const url = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "renderer/dist/index.html")}`;

  win.loadURL(url);
}

app.disableHardwareAcceleration();

app.whenReady().then(createWindow);
