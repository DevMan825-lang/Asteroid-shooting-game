const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

const spaceshipWidth = 100;
const spaceshipHeight = 120;
let spaceshipX = canvas.width / 2 - spaceshipWidth / 2;
let spaceshipY = canvas.height - spaceshipHeight - 10;
let spaceshipSpeed = 3;

const bullets = [];
const asteroids = [];
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0; // Get highest score from localStorage

const spaceshipImg = new Image();
spaceshipImg.src = 'spaceship.png';

const asteroidImg = new Image();
asteroidImg.src = 'asteroid.png';

const shootSound = document.getElementById("shootSound");
const burstSound = document.getElementById("burstSound");
const appSound = document.getElementById("appSound"); 

const keys = {
  left: false,
  right: false,
  space: false
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") keys.space = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " ") keys.space = false;
});

const leftButton = document.getElementById("leftBtn");
const rightButton = document.getElementById("rightBtn");
const fireButton = document.getElementById("fireBtn");

leftButton.addEventListener("click", () => {
  keys.left = true;
  keys.right = false;
});

rightButton.addEventListener("click", () => {
  keys.right = true;
  keys.left = false;
});

fireButton.addEventListener("click", () => {
  keys.space = true;
  setTimeout(() => { keys.space = false; }, 100);
});

function drawSpaceship() {
  ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY, spaceshipWidth, spaceshipHeight);
}

function moveSpaceship() {
  if (keys.left && spaceshipX > 0) spaceshipX -= spaceshipSpeed;
  if (keys.right && spaceshipX < canvas.width - spaceshipWidth) spaceshipX += spaceshipSpeed;
}

function shootBullet() {
  bullets.push({ x: spaceshipX + spaceshipWidth / 2 - 5, y: spaceshipY, width: 5, height: 10 });
  shootSound.play();
}

function moveBullets() {
  bullets.forEach(bullet => bullet.y -= 7);
  bullets.filter(bullet => bullet.y > 0);
}

function drawBullets() {
  ctx.fillStyle = "#ff0";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function createAsteroid() {
  const x = Math.random() * (canvas.width - 10);
  asteroids.push({ x, y: 10, width: 100, height: 100 });
}

function moveAsteroids() {
  asteroids.forEach(asteroid => asteroid.y += 3);
  asteroids.filter(asteroid => asteroid.y < canvas.height);
}

function drawAsteroids() {
  asteroids.forEach(asteroid => {
    ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  });
}

function checkCollisions() {
  asteroids.forEach((asteroid, aIdx) => {
    if (
      spaceshipX < asteroid.x + asteroid.width &&
      spaceshipX + spaceshipWidth > asteroid.x &&
      spaceshipY < asteroid.y + asteroid.height &&
      spaceshipY + spaceshipHeight > asteroid.y
    ) {
      // Game over condition removed
    }

    bullets.forEach((bullet, bIdx) => {
      if (
        bullet.x < asteroid.x + asteroid.width &&
        bullet.x + bullet.width > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + bullet.height > asteroid.y
      ) {
        asteroids.splice(aIdx, 2);
        bullets.splice(bIdx, 2);
        score += 20;
        burstSound.play();
      }
    });
  });
}

function updateScore() {
  var x = document.getElementById("score").textContent = score;
  
  if (x === 200) {
    document.getElementById("demo").textContent = "Good";
  }
  else if (x === 400) {
    document.getElementById("demo").textContent = "Awesome";
  }
  else if (x === 600) {
    document.getElementById("demo").textContent = "Excellent";
  }
  else if (x === 800) {
    document.getElementById("demo").textContent = "Best";
  }
  else if (x === 1000) {
    document.getElementById("demo").textContent = "You are awesome";
    appSound.play(); 
  }
  else if (x === 1500) {
    document.getElementById("demo").textContent = "You doing great";
  }
  else if (x === 2000) {
    document.getElementById("demo").textContent = "You doing awesome";
    appSound.play(); 
  }
  else if (x === 3000) {
    document.getElementById("demo").textContent = "You're excellence is gone too far";
    appSound.play(); 
  }
else if (x === 4000) {
    document.getElementById("demo").textContent = "You're playing style is very unique";
    appSound.play(); 
  }
  else if (x === 5000) {
    document.getElementById("demo").textContent = "As a player You're level is very up";
    appSound.play(); 
  }
else if (x === 10000) {
    document.getElementById("demo").textContent = "As a 10,000 points collector you do not need any other recognition";
    appSound.play(); 
  }

  // Update highest score if current score is higher
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore); // Save the new highest score
    document.getElementById("highestScore").textContent = "Highest Score: " + highestScore; // Display the highest score
    
  }
 
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveSpaceship();
  drawSpaceship();

  if (keys.space) shootBullet();
  moveBullets();
  drawBullets();

  if (Math.random() < 0.02) createAsteroid();
  moveAsteroids();
  drawAsteroids();

  checkCollisions();
  updateScore();

  requestAnimationFrame(gameLoop);
}

// Display the highest score when the game starts
let playerName = prompt("Enter Player Name:")
alert(playerName + " " + "you set a new record." + " " + "Your New highest score is" + " " + highestScore);
document.getElementById("highestScore").textContent = "Highest Score: " + highestScore;

gameLoop();
