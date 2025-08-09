import fs from "fs/promises";
import path from "path";
import { CheckFileExists } from "./helpers/fileExists.js";
import { clearTimeout } from "node:timers";

//------------------------------------------------Internal------------------------------------------------
let mediaFolderPath = "";

let mediaPlayer = document.getElementById("media-player") as
  | HTMLVideoElement
  | HTMLImageElement
  | HTMLDivElement;

let playTV: boolean = false;
let paused: boolean = false;
let mediaPlayerImageTimer: NodeJS.Timeout;

const videoExtensions: string[] = [".mp4", ".mkv", ".avi", ".mov"];
const imageExtensions: string[] = [".jpg", ".jpeg", ".png", ".gif"];

let mediaFilesIndex: string[] = [];

//------------------------------------------------Configuration------------------------------------------------
let randomSkipMediaTimer = 0;
let advertMediaPath = "";
let playAdvert = false;

export async function Start() {
  // InitializeMediaPlayer();

  playTV = true;

  if (!mediaFolderPath) {
    console.error("Media folder path is not set.");
    return;
  }

  let timer = 0;

  if (randomSkipMediaTimer > 0) {
    timer = randomSkipMediaTimer;
  }

  await PlayMediaRandomly(timer);
}

async function PlayMediaRandomly(timer: number) {
  if (!playTV) {
    return;
  }

  mediaFilesIndex = await IndexMediaFolder();

  if (mediaFilesIndex.length === 0) {
    console.error("No media files found in the specified folder.");
    return;
  }

  const mediaIndex = Math.floor(Math.random() * mediaFilesIndex.length); // .floor to round integer

  let mediaElement: HTMLVideoElement | HTMLImageElement;

  if (!mediaPlayer) {
    console.error("Media player element not found.");
    return;
  }

  let mediaFilePath = mediaFilesIndex[mediaIndex];

  if (mediaFilePath === undefined) {
    console.error("Media File Path is null", mediaIndex);
    return;
  }

  let checkFileExists = await CheckFileExists(mediaFilePath);

  if (!checkFileExists) {
    console.error("Media file does not exist:", mediaFilePath);
    return;
  }

  const fileExtension = mediaFilePath
    .substring(mediaFilePath.lastIndexOf("."))
    .toLowerCase();

  if (videoExtensions.includes(fileExtension)) {
    // Create a video element for videos
    const video = document.createElement("video");
    video.src = mediaFilePath;
    video.controls = false;
    video.autoplay = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    mediaElement = video;
  } else if (imageExtensions.includes(fileExtension)) {
    // Create image element for photos
    const img = document.createElement("img");
    img.src = mediaFilePath;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    mediaElement = img;
  } else {
    console.error("Unsupported media type:", fileExtension);
    return;
  }

  mediaPlayer = mediaElement;

  if (mediaPlayer instanceof HTMLVideoElement) {
    mediaPlayer.addEventListener("ended", function () {
      PlayAdvert();
      PlayMediaRandomly(timer);
    });
  } else {
    // for images
    mediaPlayerImageTimer = setTimeout(() => {
      PlayAdvert();
      PlayMediaRandomly(timer);
    }, 5000);
  }
}

async function TogglePause() {
  playTV = !playTV;
  paused = !paused;

  if (mediaPlayer instanceof HTMLVideoElement) {
    if (paused) {
      mediaPlayer.pause();
    } else {
      playTV = true;
      mediaPlayer.play();
    }
  } else {
    if (paused) {
      clearTimeout(mediaPlayerImageTimer);
    } else {
      playTV = true;
      mediaPlayerImageTimer = setTimeout(() => PlayMediaRandomly(0), 5000);
    }
  }
}

async function IndexMediaFolder() {
  try {
    const files = await fs.readdir(mediaFolderPath);
    const mediaFiles: string[] = [];

    for (const file of files) {
      const filePath = path.join(mediaFolderPath, file);
      const fileInfo = await fs.stat(filePath);
      if (
        fileInfo.isFile() &&
        videoExtensions
          .concat(imageExtensions)
          .includes(path.extname(file).toLowerCase())
      ) {
        mediaFiles.push(filePath);
      }
    }

    return mediaFiles;
  } catch (error) {
    console.error("Error reading media files:", error);
    return [];
  }
}

function PickMediaFolderPath(path: string) {
  mediaFolderPath = path;

  setTimeout(() => Start(), 1000);
}

function PickAdvertMedaPath(path: string) {
  advertMediaPath = path;
}

/*
function InitializeMediaPlayer() {
  if (!mediaPlayer) {
    console.error("Media player element not found.");
    return;
  }

  mediaPlayer.innerHTML = "";
}
*/

export function SetTimer(timer: number) {
  randomSkipMediaTimer = timer;
}

async function PlayAdvert() {
  if (advertMediaPath === null || advertMediaPath === "") {
    console.error("Advert media path is not set.");
    return;
  }

  const video = document.createElement("video");
  video.src = advertMediaPath;
  video.controls = false;
  video.autoplay = true;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  mediaPlayer = video;
}

//------------------------------------------------Events/Subscriptions------------------------------------------------
window.addEventListener("resize", function () {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
