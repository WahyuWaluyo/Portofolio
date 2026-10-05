document.getElementById("tahun").textContent = new Date().getFullYear();

// Mini game: lompati rintangan
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hint = document.getElementById("hint");
const W = canvas.width, H = canvas.height, GROUND = H - 24;

const css = getComputedStyle(document.documentElement);
const COLOR_PLAYER = css.getPropertyValue("--accent").trim();
const COLOR_OBSTACLE = css.getPropertyValue("--muted").trim();
const COLOR_LINE = css.getPropertyValue("--line").trim();

let player, obstacles, speed, score, best = 0, running = false, frame = 0;

function reset() {
  player = { x: 50, y: GROUND - 28, w: 28, h: 28, vy: 0 };
  obstacles = [];
  speed = 4;
  score = 0;
  frame = 0;
}

function jump() {
  if (!running) {
    reset();
    running = true;
    hint.textContent = "Lompati rintangannya!";
    requestAnimationFrame(loop);
    return;
  }
  if (player.y >= GROUND - player.h) player.vy = -10.5;
}

function update() {
  frame++;
  player.vy += 0.6;
  player.y = Math.min(player.y + player.vy, GROUND - player.h);
  if (player.y === GROUND - player.h) player.vy = 0;

  if (frame % Math.max(50, 95 - Math.floor(score / 5)) === 0) {
    const h = 20 + Math.random() * 22;
    obstacles.push({ x: W, y: GROUND - h, w: 18, h });
  }
  obstacles.forEach(o => (o.x -= speed));
  obstacles = obstacles.filter(o => o.x + o.w > 0);

  if (frame % 60 === 0) { score++; speed += 0.03; }

  for (const o of obstacles) {
    if (player.x < o.x + o.w && player.x + player.w > o.x &&
        player.y < o.y + o.h && player.y + player.h > o.y) {
      running = false;
      best = Math.max(best, score);
      hint.textContent = `Skor ${score}, terbaik ${best}. Klik atau tekan Spasi untuk main lagi.`;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = COLOR_LINE;
  ctx.fillRect(0, GROUND, W, 2);
  ctx.fillStyle = COLOR_PLAYER;
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = COLOR_OBSTACLE;
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
  ctx.fillStyle = COLOR_OBSTACLE;
  ctx.font = "16px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`Skor ${score}`, W - 12, 24);
}

function loop() {
  update();
  draw();
  if (running) requestAnimationFrame(loop);
}

reset();
draw();

canvas.addEventListener("pointerdown", jump);
window.addEventListener("keydown", e => {
  if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    e.preventDefault();
    jump();
  }
});
