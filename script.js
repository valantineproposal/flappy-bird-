const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dynamic canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.5;
let gameOver = false;
let score = 0;

// Bird
let bird = {
  x: canvas.width * 0.2,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  velocity: 0,
  lift: -10
};

// Pipes
let pipes = [];

// Controls (PC)
document.addEventListener("keydown", jump);

// Controls (Mobile)
document.addEventListener("touchstart", jump);

function jump() {
  if (gameOver) {
    location.reload();
  }
  bird.velocity = bird.lift;
}

// Create pipes
function createPipe() {
  let gap = canvas.height * 0.25;
  let topHeight = Math.random() * (canvas.height - gap - 100) + 50;

  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: canvas.height - topHeight - gap
  });
}

// Draw bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

// Collision check
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

    // Gravity
    bird.velocity += gravity;
    bird.y += bird.velocity;

    // Ground & Top collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
      gameOver = true;
    }

    // Create pipes
    if (Math.random() < 0.02) {
      createPipe();
    }

    pipes.forEach(pipe => {
      pipe.x -= 3;

      if (checkCollision(pipe)) {
        gameOver = true;
      }

      if (pipe.x + pipe.width === bird.x) {
        score++;
      }
    });
  }

  drawBird();
  drawPipes();

  // Score
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 50);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 140, canvas.height / 2);
    ctx.font = "25px Arial";
    ctx.fillText("Tap or Press Key to Restart", canvas.width / 2 - 160, canvas.height / 2 + 50);
  }

  requestAnimationFrame(update);
}

update();