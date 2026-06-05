const { app, BrowserWindow, dialog } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const { autoUpdater } = require('electron-updater')

let backendProcess, faceProcess

function startBackend() {
  const jarPath = app.isPackaged 
    ? path.join(process.resourcesPath, 'backend.jar') 
    : path.join(__dirname, '../../backend/target/backend.jar')
  const backendCwd = app.isPackaged
    ? process.resourcesPath
    : path.join(__dirname, '../../backend')
  
  // We don't fail if the jar is missing during dev, just log it
  try {
    backendProcess = spawn('java', ['-jar', jarPath], { cwd: backendCwd })
    backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`))
    backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`))
    backendProcess.on('error', (err) => console.error('Backend spawn error:', err))
  } catch (err) {
    console.error('Failed to start backend', err)
  }
}

function startFaceService() {
  const isPackaged = app.isPackaged;
  const backendCwd = isPackaged ? process.resourcesPath : path.join(__dirname, '../../backend');
  const dbPath = path.join(backendCwd, 'data', 'attendx.db');
    
  try {
    if (isPackaged) {
      const exePath = path.join(process.resourcesPath, 'face_service/app.exe');
      faceProcess = spawn(exePath, [], { 
        cwd: path.join(process.resourcesPath, 'face_service'),
        env: { ...process.env, ATTENDX_DB_PATH: dbPath }
      });
    } else {
      const scriptPath = path.join(__dirname, '../../mediapipe_face/app.py');
      faceProcess = spawn('python', [scriptPath], { 
        cwd: path.join(__dirname, '../../mediapipe_face'),
        env: { ...process.env, ATTENDX_DB_PATH: dbPath }
      });
    }
    faceProcess.stdout.on('data', (data) => console.log(`Face: ${data}`))
    faceProcess.stderr.on('data', (data) => console.error(`Face Error: ${data}`))
    faceProcess.on('error', (err) => console.error('Face spawn error:', err))
  } catch (err) {
    console.error('Failed to start face service', err)
  }
}

// Configure autoUpdater settings
autoUpdater.autoDownload = false

function checkUpdates(mainWindow) {
  // 1. When an update is detected
  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) of AttendX is available. Do you want to download it?`,
      buttons: ['Yes', 'No']
    }).then((result) => {
      if (result.response === 0) { // User clicked 'Yes'
        autoUpdater.downloadUpdate()
      }
    })
  })

  // 2. When download is complete, prompt to install and restart
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: 'The update has been downloaded. The application will now restart to install the update.',
      buttons: ['Restart Now']
    }).then(() => {
      // Cleanly kill backend and face service before restart
      if (backendProcess) backendProcess.kill()
      if (faceProcess) faceProcess.kill()
      
      // Install and restart
      autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater:', err)
  })

  // Check for updates
  autoUpdater.checkForUpdates()
}

app.whenReady().then(() => {
  startBackend()
  startFaceService()

  const win = new BrowserWindow({ 
    width: 1280, 
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Required: allows file:// protocol to load local JS/CSS without
      // CORS blocking (crossorigin attributes on Vite-built assets would
      // otherwise cause a blank white page in packaged builds).
      webSecurity: false
    }
  })

  // Log renderer errors to main process console for diagnostics
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`[Renderer] Failed to load: ${validatedURL} — ${errorDescription} (${errorCode})`)
  })

  win.webContents.on('render-process-gone', (event, details) => {
    console.error('[Renderer] Render process gone:', details.reason)
  })
  
  // In development, load from Vite dev server.
  // In production, load the built index.html.
  if (app.isPackaged) {
    const indexPath = path.join(__dirname, '../renderer/index.html')
    win.loadFile(indexPath).catch(err => {
      console.error('[Main] Failed to load index.html:', err)
    })

    // Check for updates shortly after app loads in production
    // (Disabled for v3.0 - before auto updater version)
    // win.once('ready-to-show', () => {
    //   setTimeout(() => {
    //     checkUpdates(win)
    //   }, 5000)
    // })
  } else {
    // Wait for backend to start, then load
    setTimeout(() => win.loadURL('http://localhost:5173'), 3000)
  }
})

app.on('quit', () => {
  if (backendProcess) backendProcess.kill()
  if (faceProcess) faceProcess.kill()
})
