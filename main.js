const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

require('./server/routers/RoutersIPC')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = !app.isPackaged;
  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'renderer/dist/index.html')}`;

  win.loadURL(url);
}

app.whenReady().then(createWindow);