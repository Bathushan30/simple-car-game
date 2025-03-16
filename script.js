// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Load car image
const carImage = new Image();
carImage.src = "car.png";

// Player car properties
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    width: 50,
    height: 100,
    speed: 8, // Increased speed for better movement
    movingLeft: false,
    movingRight: false
};

// Enemy cars array
let enemies = [];
let score = 0;
let gameRunning = false;

// Event listeners for key press (smooth movement)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") player.movingLeft = true;
    if (event.key === "ArrowRight") player.movingRight = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") player.movingLeft = false;
    if (event.key === "ArrowRight") player.movingRight = false;
});

// Create enemy cars
function createEnemy() {
    let enemy = {
        x: Math.random() * (canvas.width - 50),
        y: -100,
        width: 50,
        height: 100,
        speed: 3 + Math.random() * 2
    };
    enemies.push(enemy);
}

// Update game logic
function update() {
    if (!gameRunning) return;

    // Move player left/right smoothly
    if (player.movingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Move enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;

        // Check collision
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameRunning = false;
            alert("Game Over! Score: " + score);
            document.location.reload();
        }

        // Remove off-screen enemies
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            score += 10;
        }
    });

    // Generate new enemies
    if (Math.random() < 0.02) createEnemy();
}

// Draw elements on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player car
    ctx.drawImage(carImage, player.x, player.y, player.width, player.height);

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

// Start game
document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    gameRunning = true;
    gameLoop();
});

// Pause game
document.getElementById("pause-button").addEventListener("click", () => {
    gameRunning = !gameRunning;
    if (gameRunning) gameLoop();
});
// Load background music
const bgMusic = new Audio("background-music.mp3"); 
bgMusic.loop = true; // Make the music loop
bgMusic.volume = 0.5; // Set volume (adjust as needed)

// Play music when the game starts
document.getElementById("start-button").addEventListener("click", () => {
    bgMusic.play().catch(error => console.log("Music Play Error: ", error));
});

// Pause music when the game is paused
document.getElementById("pause-button").addEventListener("click", () => {
    if (gameRunning) {
        bgMusic.pause();
    } else {
        bgMusic.play();
    }
});
