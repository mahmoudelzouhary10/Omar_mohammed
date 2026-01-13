const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// صور
const playerImg = new Image();
playerImg.src = "player.png";

const obstacleImg = new Image();
obstacleImg.src = "obstacle.png";

// الأرض
let ground = 320;

// اللاعب
let player = {
  x: 80,
  y: ground,
  w: 90,
  h: 120,
  dy: 0,
  jumping: false
};

// العائق
let obstacle = {
  x: canvas.width,
  y: ground + 40,
  w: 60,
  h: 60
};

let gravity = 0.6;
let speed = 6;
let gameOver = false;

// القفز
function jump() {
  if (!player.jumping) {
    player.dy = -14;
    player.jumping = true;
  }
}

// كيبورد
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// موبايل
canvas.addEventListener("touchstart", jump);

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // الأرض
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(0, ground + player.h - 20, canvas.width, 50);

  // حركة اللاعب
  player.dy += gravity;
  player.y += player.dy;

  if (player.y >= ground) {
    player.y = ground;
    player.dy = 0;
    player.jumping = false;
  }

  // رسم اللاعب
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  // حركة العائق
  obstacle.x -= speed;
  if (obstacle.x < -obstacle.w) {
    obstacle.x = canvas.width + Math.random() * 300;
  }

  // رسم العائق
  ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.w, obstacle.h);

  // تصادم
  if (
    player.x < obstacle.x + obstacle.w &&
    player.x + player.w > obstacle.x &&
    player.y < obstacle.y + obstacle.h &&
    player.y + player.h > obstacle.y
  ) {
    gameOver = true;
    alert("Game Over ⚽");
    location.reload();
  }

  requestAnimationFrame(update);
}

// تشغيل
update();