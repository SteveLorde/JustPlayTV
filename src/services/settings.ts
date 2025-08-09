import { SetTimer } from "./media.js";

const settingsModal = document.getElementById("settings") as HTMLDivElement;

let settingsVisible = false;

export function SetMediaFolderPath() {}

export function SetAdvertMediaPath() {}

export function SetSkipMediaTimer(timer: number) {
  SetTimer(timer * 60 * 1000);
}

function ToggleSettings() {
  settingsVisible = !settingsVisible;

  if (settingsVisible) {
    settingsModal.classList.add("settings-open");
  } else {
    settingsModal.classList.remove("settings-close");
  }
}

export function OpenSettings() {}

function CloseSettings() {
  settingsVisible = false;
  settingsModal.classList.remove("settings-close");
}

document.addEventListener("click", function () {
  if (settingsVisible) {
    CloseSettings();
  }
});
