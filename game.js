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
let gameStarted = false;
let countingDown = false;
let countdown = 3;

// بدء العدّاد
function startCountdown() {
  if (countingDown || gameStarted) return;
  countingDown = true;

  const timer = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      clearInterval(timer);
      gameStarted = true;
      countingDown = false;
    }
  }, 1000);
}

// القفز
function jump() {
  if (!gameStarted) {
    startCountdown(); // أول دوسة تشغّل العدّاد
    return;
  }

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // الأرض
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(0, ground + player.h - 20, canvas.width, 50);

  // رسم اللاعب ثابت
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  // قبل البداية
  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    if (!countingDown) {
      ctx.font = "30px Arial";
      ctx.fillText("اضغط للبدء", canvas.width / 2, canvas.height / 2);
    } else {
      ctx.font = "60px Arial";
      ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(update);
    return;
  }

  // فيزياء اللاعب
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
    alert("Game Over ⚽");
    location.reload();
  }

  requestAnimationFrame(update);
}

// تشغيل
update();
