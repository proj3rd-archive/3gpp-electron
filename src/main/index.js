'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let workerWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1200,
    height: 600
  })

  workerWindow = new BrowserWindow({show: process.env.NODE_ENV === 'development'})
  workerWindow.loadURL(`${winURL}#/worker`)
  workerWindow.on('closed', () => {
    app.quit()
  })

  ipcMain.on('worker-ready', (event, data) => {
    mainWindow.loadURL(winURL)
  })

  ipcMain.on('ie-list-request', (event, data) => {
    workerWindow.webContents.send('ie-list-request', data)
  })

  ipcMain.on('ie-list-response', (event, data) => {
    mainWindow.webContents.send('ie-list-response', data)
  })

  ipcMain.on('format-request', (event, data) => {
    workerWindow.webContents.send('format-request', data)
  })

  ipcMain.on('format-response', (event, data) => {
    mainWindow.webContents.send('format-response', data)
  })

  ipcMain.on('idc-request', (event, data) => {
    workerWindow.webContents.send('idc-request', data)
  })

  ipcMain.on('idc-response', (event, data) => {
    mainWindow.webContents.send('idc-response', data)
  })

  ipcMain.on('diff-request', (event, data) => {
    workerWindow.webContents.send('diff-request', data)
  })

  ipcMain.on('diff-response', (event, data) => {
    mainWindow.webContents.send('diff-response', data)
  })

  mainWindow.on('closed', () => {
    app.quit()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
