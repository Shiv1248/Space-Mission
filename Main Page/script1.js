var canvas = document.getElementById("canvas1");
var box = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 15;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRCount = 6;
var brickCCount = 8;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffSetTop = 30;
var brickOffSetLeft = 30;
var score = 0;
var lives = 3;

const scoreScreen = document.getElementById("tudo");
const scr = document.getElementById("scr");

var bricks = [];
for (let c = 0; c < brickCCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

document.addEventListener("mousemove", movepaddle);

function movepaddle(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (
    relativeX > 0 + paddleWidth / 2 &&
    relativeX < canvas.width - paddleWidth / 2
  ) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
function drawBricks() {
  for (let c = 0; c < brickCCount; c++) {
    for (let r = 0; r < brickRCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffSetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffSetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        box.beginPath();
        box.rect(brickX, brickY, brickWidth, brickHeight);
        box.fillStyle = "pink";
        box.fill();
        box.strokeStyle = "white";
        box.stroke();
        box.closePath();
      }
    }
  }
}

function keydown(e) {
  if (e.key == "ArrowLeft") {
    rightPressed = true;
  } else if (e.key == "ArrowRight") {
    leftPressed = true;
  }
}

function keyup(e) {
  if (e.key == "ArrowLeft") {
    rightPressed = false;
  } else if (e.key == "ArrowRight") {
    leftPressed = false;
  }
}

function drawBall() {
  box.beginPath();
  box.arc(x, y, ballRadius, 0, Math.PI * 2);
  box.fillStyle = "yellow";
  box.fill();
  box.closePath();
}

function drawPaddle() {
  box.beginPath();
  box.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  box.fillStyle = "black";
  box.fill();
  box.closePath();
}
function collisonDetection() {
  for (var c = 0; c < brickCCount; c++) {
    for (var r = 0; r < brickRCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          ++score;
          var audio1 = new Audio("../a_sound/Blocks.mp3");
          audio1.play();
          if (brickCCount * brickRCount == score) {
            // WIN
            document.getElementById("res1").innerHTML = "YOU";
            document.getElementById("res2").innerHTML = "WIN";
            scoreScreen.style.display = "block";
            scr.innerHTML = score;
          }
        }
      }
    }
  }
}

function drawScore() {
  box.font = "20px Arial";
  box.fillStyle = "white";
  box.fillText("Score:" + score, 8, 20);
}

function drawLives() {
  box.font = "20px Arial";
  box.fillStyle = "white";
  box.fillText("Lives:" + lives, canvas.width - 65, 20);
}
function draw() {
  box.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawLives();
  drawBall();
  drawPaddle();
  drawScore();
  collisonDetection();

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - 2 * ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      var audio3 = new Audio("../a_sound/Paddlesound.mp3");
      audio3.play();
    } else {
      lives = lives - 1;
      if (!lives) {
        // "GAME OVER"
        scoreScreen.style.display = "block";
        scr.innerHTML = score;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
    if (lives && brickCCount * brickRCount != score) {
      var audio2 = new Audio("../a_sound/Wall.mp3");
      audio2.play();
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  if (!lives || brickCCount * brickRCount == score) {
    x = 0;
    y = 0;
  } else {
    x += dx;
    y += dy;
  }
}

document.getElementById("playAgainYes").addEventListener("click", () => {
  location.reload();
});

document.getElementById("playAgainNo").addEventListener("click", () => {
  location.href = "../First Page/firstPage.html";
});

setInterval(draw, 7);
