const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { io } = require('socket.io-client');  // Import Socket.io Client

let socket;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
  });

  win.loadFile('index.html');
}

ipcMain.handle('dialog:openFile', async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'ogg', 'wmv', '3gp'] }],
    });

    if (result.filePaths.length > 0) {
      console.log('Selected File:', result.filePaths[0]);
      return result.filePaths[0];
    } else {
      console.log('No file selected');
      return null;
    }
  } catch (err) {
    console.error('Error during file selection:', err);
    return null;
  }
});

app.whenReady().then(() => {
  // Establish Socket connection
  socket = io('wss://seriousserver-production.up.railway.app');
  
  socket.on('connect', () => {
    console.log('Connected to WebSocket Server');
  });

  socket.on('syncMedia', (data) => {
    console.log('Received sync media data:', data);
    // Handle media sync here
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});