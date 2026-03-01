const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Bird
let bird = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

// Pipes
let pipes = [];
let frame = 0;
let score = 0;

// Controls
document.addEventListener("keydown", () => {
  bird.velocity = bird.lift;
});

// Create pipes
function createPipe() {
  let gap = 150;
  let topHeight = Math.random() * 300 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap,
    width: 50
  });
}

// Draw Bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw Pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

// Update Game
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();

  if (frame % 90 === 0) {
    createPipe();
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top ||
       bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }

    if (pipe.x + pipe.width === bird.x) {
      score++;
    }
  });

  drawPipes();

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  frame++;
  requestAnimationFrame(update);
}

update();