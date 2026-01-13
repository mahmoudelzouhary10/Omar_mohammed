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
let speed = 6;
let jumpPower = -18; // ⬅️ جامب أعلى

/* ====== حالة اللعبة ====== */
let gameStarted = false;
let countingDown = false;
let countdown = 3;
let gameOver = false;

/* ====== الاسكور ====== */
let score = 0;
let passedObstacle = false;

/* ====== زرار ريستارت ====== */
const restartBtn = document.createElement("button");
restartBtn.innerText = "Restart";
restartBtn.style.position = "absolute";
restartBtn.style.top = "50%";
restartBtn.style.left = "50%";
restartBtn.style.transform = "translate(-50%, -50%)";
restartBtn.style.padding = "15px 30px";
restartBtn.style.fontSize = "20px";
restartBtn.style.display = "none";
document.body.appendChild(restartBtn);

restartBtn.onclick = () => location.reload();

/* ====== بدء العدّاد ====== */
function startCountdown() {
  if (countingDown || gameStarted) return;

  countingDown = true;
  countdown = 3;

  const timer = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      clearInterval(timer);
      gameStarted = true;
      countingDown = false;
    }
  }, 1000);
}

/* ====== القفز ====== */
function jump() {
  if (gameOver) return;

  if (!gameStarted) {
    startCountdown();
    return;
  }

  if (!player.jumping) {
    player.dy = jumpPower;
    player.jumping = true;
  }
}

/* ====== تحكم ====== */
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

canvas.addEventListener("touchstart", jump);

/* ====== التحديث ====== */
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* الأرض */
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(0, ground + player.h - 20, canvas.width, 50);

  /* الاسكور */
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 30);

  /* قبل البداية */
  if (!gameStarted) {
    ctx.textAlign = "center";

    if (!countingDown) {
      ctx.font = "30px Arial";
      ctx.fillText("اضغط للبدء", canvas.width / 2, canvas.height / 2);
    } else {
      ctx.font = "60px Arial";
      ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
    }

    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    requestAnimationFrame(update);
    return;
  }

  /* فيزياء اللاعب */
  player.dy += gravity;
  player.y += player.dy;

  if (player.y >= ground) {
    player.y = ground;
    player.dy = 0;
    player.jumping = false;
  }

  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

  /* حركة العائق */
  obstacle.x -= speed;

  if (obstacle.x + obstacle.w < player.x && !passedObstacle) {
    score += 10;
    passedObstacle = true;

    // ⬆️ زيادة السرعة مع الاسكور
    speed = 6 + score * 0.05;
  }

  if (obstacle.x < -obstacle.w) {
    obstacle.x = canvas.width + Math.random() * 300;
    passedObstacle = false;
  }

  ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.w, obstacle.h);

  /* Hitbox */
  const playerHitbox = {
    x: player.x + 25,
    y: player.y + 20,
    w: player.w - 50,
    h: player.h - 30
  };

  const obstacleHitbox = {
    x: obstacle.x + 10,
    y: obstacle.y + 10,
    w: obstacle.w - 20,
    h: obstacle.h - 20
  };

  /* تصادم */
  if (
    playerHitbox.x < obstacleHitbox.x + obstacleHitbox.w &&
    playerHitbox.x + playerHitbox.w > obstacleHitbox.x &&
    playerHitbox.y < obstacleHitbox.y + obstacleHitbox.h &&
    playerHitbox.y + playerHitbox.h > obstacleHitbox.y
  ) {
    gameOver = true;
    restartBtn.style.display = "block";
    alert("كسم الضحك 😂");
  }

  if (!gameOver) requestAnimationFrame(update);
}

/* ====== تشغيل ====== */
update();
