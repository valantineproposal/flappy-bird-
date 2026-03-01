const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Bird
let bird = {
  x: 80,
  y: 200,
  radius: 15,
  gravity: 0.35,
  lift: -6,
  velocity: 0
};

// Pipes
let pipes = [];
let pipeWidth = 60;
let gap = 220;
let frame = 0;
let score = 0;

// 🔥 High Score (NEW)
let highScore = localStorage.getItem("highScore") || 0;

// Jump control (PC + Mobile)
function jump() {
  bird.velocity = bird.lift;
}

document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function createPipe() {
  let top = Math.random() * (canvas.height - gap - 100) + 50;
  pipes.push({
    x: canvas.width,
    top: top,
    bottom: top + gap
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.radius > canvas.height) {
    bird.y = canvas.height - bird.radius;
    bird.velocity = 0;
  }

  if (bird.y - bird.radius < 0) {
    bird.y = bird.radius;
    bird.velocity = 0;
  }

  // Draw bird
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();

  // Pipes
  if (frame % 90 === 0) {
    createPipe();
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    // Draw pipes
    ctx.fillStyle = "green";
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height);

    // Collision
    if (
      bird.x + bird.radius > p.x &&
      bird.x - bird.radius < p.x + pipeWidth &&
      (bird.y - bird.radius < p.top ||
        bird.y + bird.radius > p.bottom)
    ) {
      location.reload();
    }

    // Score
    if (p.x + pipeWidth === bird.x) {
      score++;

      // 🔥 Update High Score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
    }
  }

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 50);

  // 🔥 Draw High Score
  ctx.fillText("High Score: " + highScore, 20, 90);

  frame++;
  requestAnimationFrame(update);
}

update();