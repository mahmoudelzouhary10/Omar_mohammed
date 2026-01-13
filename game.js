const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ====== الصور ====== */
const playerImg = new Image();
playerImg.src = "player.png";

const obstacleImg = new Image();
obstacleImg.src = "obstacle.png";

/* ====== الأرض ====== */
let ground = 320;

/* ====== اللاعب ====== */
let player = {
  x: 80,
  y: ground,
  w: 90,
  h: 120,
  dy: 0,
  jumping: false
};

/* ====== العائق ====== */
let obstacle = {
  x: canvas.width,
  y: ground + 40,
  w: 60,
  h: 60
};

/* ====== إعدادات ====== */
let gravity = 0.6;
let speed = 6
