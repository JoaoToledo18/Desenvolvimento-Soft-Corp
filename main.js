import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import './server/routers/RoutersIPC.js';

// Corrige __dirname e __filename no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const isDev = !app.isPackaged;
  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'renderer/dist/index.html')}`;

  win.loadURL(url);
}

app.disableHardwareAcceleration();

app.whenReady().then(createWindow);
