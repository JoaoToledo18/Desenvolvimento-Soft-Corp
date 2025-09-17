const {app, BrowserWindow} = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width:800,
        height:800,
    })
    win.loadURL('http://localhost:4040')
}

app.whenReady().then(()=>{
    require('./server/app')
    createWindow()
})