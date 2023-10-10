const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs/promises');
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    console.log(ipcMain)
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'dist/electron-angular/index.html'),
            protocol: "file:",
            slashes: true
        })
    );
    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
    ipcMain.on('save-data', async (event, data) => {
        try {
            console.log('dddrr')

            await fs.writeFile('data.txt', data);
            event.sender.send('data-saved');
            event.sender.send('data-read', data);
        } catch (error) {
            event.sender.send('save-error', error.message);
        }
    });

    ipcMain.on('read-data', async (event) => {

        try {
            const data = await fs.readFile('data.txt', 'utf-8');
            console.log('---000', data)
            event.sender.send('data-read', data);
        } catch (error) {
            console.log('sdffd', error)
            event.sender.send('read-error', error.message);
        }
    });
}

app.on('ready', createWindow)
ipcMain.on('example-channel', (event, arg) => {
    // Handle the IPC event and send a response back if needed
    event.reply('example-reply', 'This is a reply from the main process.');
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})