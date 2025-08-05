import { app, BrowserWindow } from "electron";
import { Start } from "./services/media.js";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: "./preload.js",
    },
  });

  win.loadFile("main.html");
};

app.whenReady().then(() => {
  createWindow();
  Start();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
