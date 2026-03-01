const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Fixed game size (better performance)
canvas.width = 400;
canvas.height = 600;

// Scale for mobile
const scale = Math.min(window.innerWidth / 400, window.innerHeight / 600);
canvas.style.width = 400 * scale + "px";
canvas.style.height = 600 * scale + "px";

let gravity = 0.5;
let gameOver = false;
let score = 0;
let frame = 0;

// Bird
let bird = {
  x: 80,
  y: 250,
  width: 30,
  height: 30,
  velocity: 0,
  lift: -9
};

// Pipes
let pipes = [];

// Controls
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function jump() {
  if (gameOver) {
    location.reload();
  }
  bird.velocity = bird.lift;
}

function createPipe() {
  let gap = 150;
  let topHeight = Math.random() * 300 + 50;

  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: canvas.height - topHeight - gap,
    passed: false
  });
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function checkCollision(pipe) {
  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    (bird.y < pipe.top ||
     bird.y + bird.height > canvas.height - pipe.bottom)
  );
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    frame++;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
      gameOver = true;
    }

    if (frame % 90 === 0) {
      createPipe();
    }

    pipes.forEach(pipe => {
      pipe.x -= 2.5;

      if (checkCollision(pipe)) {
        gameOver = true;
      }

      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        score++;
        pipe.passed = true;
      }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
  }

  drawBird();
  drawPipes();

  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 110, 300);
    ctx.font = "18px Arial";
    ctx.fillText("Tap to Restart", 140, 340);
  }

  requestAnimationFrame(update);
}

update();