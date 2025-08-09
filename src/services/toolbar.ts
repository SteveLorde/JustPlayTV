const toolbarContainer = document.getElementById(
  "toolbar-container",
) as HTMLElement;
const toolbar = document.getElementById("toolbar") as HTMLElement;

const settingsButton = document.getElementById(
  "settings-button",
) as HTMLElement;
const pauseButton = document.getElementById("pause-button") as HTMLElement;
const fullscreenButton = document.getElementById(
  "fullscreen-button",
) as HTMLElement;

let showToolbar = false;

toolbarContainer.addEventListener("pointerenter", function () {
  showToolbar = true;

  toolbar.classList.add("modal-open");
});

toolbarContainer.addEventListener("pointerleave", function () {
  showToolbar = false;

  toolbar.classList.add("modal-close");

  setTimeout(() => toolbar.classList.remove("modal-close"), 1000);
});
