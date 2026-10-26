// balright! it is time... to make the platformer!!! :3

// dependencies
import {
    Level
} from "./level.js"
import {
    Obstacle
} from "./world.js";

// constant variables
const canvas = document.getElementById("game"); // here is the fabeled canvas!
const ctx = canvas.getContext("2d");    // get the context for our canvas. i am NOT making a 3d game
const keys = {};    // keyboard input
const music = new Audio("song.wav");
const levels = [    // level data
    new Level(canvas, [
        new Obstacle(200, 350, 150, 50),
        new Obstacle(450, 350, 150, 50),
    ]),
    new Level(canvas, [
        new Obstacle(150, 250, 50, 50),
        new Obstacle(300, 325, 50, 50),
        new Obstacle(300, 175, 50, 50),
        new Obstacle(375, 225, 50, 175),
    ]),
    new Level (canvas, [
        new Obstacle(300, 375, 50, 25),
        new Obstacle(400, 325, 50, 75),
        new Obstacle(500, 275, 50, 125),
        new Obstacle(600, 200, 50, 200),
    ])
];

// variables
let playerSize = 40;    // defines how wide/tall the sprite is
let playerX;    // player position
let playerY;    // ^~~~~~~~~~~~~~^
let vertVelo;   // vertical velocity
let vertStep = 1;   // step of velocity
let updScale = 0.5; // vertical velocity update scale
let horiVelo = 5;   // horizontal velocity magnitude
let inAir;  // player is in the air
let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

// initialize player
function initPlayer() {
    playerX = 50;
    playerY = canvas.height - 4 * playerSize;
    vertVelo = 0;
    inAir = true;
}

// listen for key events for our controls
document.addEventListener("keydown", function(event) {
    keys[event.code] = true;

    // keep the page from scrolling
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.code] = false;
});

// draw levels
function drawLevel() {
    for (const obstacle of currentLevel.obstacles) {    // draw obstacles
        obstacle.draw(ctx);
    }
    currentLevel.checkpoint.draw(ctx);
}

// check for checkpoint reached
function checkpoint() {
    return (playerX + playerSize >= currentLevel.checkpoint.boundX.min && playerX <= currentLevel.checkpoint.boundX.max && playerY + playerSize >= currentLevel.checkpoint.boundY.min && playerY <= currentLevel.checkpoint.boundY.max);
}

// check for if player is in air
function checkAir() {
    if (vertVelo > 0) {     // if user hits obstacle on their top
        const hitObstacle = currentLevel.obstacles.find(obstacle => playerX + playerSize > obstacle.boundX.min && playerX < obstacle.boundX.max && (playerY - (vertVelo - vertStep) * updScale) <= obstacle.boundY.max && playerY >= obstacle.boundY.max);
        if (hitObstacle) {  // stop user
            playerY = hitObstacle.boundY.max;
            vertVelo = 0;
        }
    }

    if (vertVelo <= 0) {    // only check if player is falling or still
        // only look for an obstacle if player overlaps horizontally, player bottom is at or above the top, and player bottom will pass/reach the top this frame
        const hitObstacle = currentLevel.obstacles.find(obstacle => playerX + playerSize > obstacle.boundX.min && playerX < obstacle.boundX.max && playerY + playerSize <= obstacle.boundY.min && (playerY - (vertVelo - vertStep) * updScale) + playerSize >= obstacle.boundY.min);
        if (hitObstacle) {  // on an obstacle
            playerY = hitObstacle.boundY.min - playerSize;
            return true;
        }
    }

    // check for if player will land on the ground
    if ((playerY - (vertVelo - vertStep) * updScale) > canvas.height - playerSize) { // on the ground
        playerY = canvas.height - playerSize;
        return true;
    }

    return false;
}

// this is where we will deal with keyboard input for movement
function movement() {
    // move left if key is held, not at left canvas bound, no obstacle is in the way (no vertical overlap), obstacle right side within reach after moving, not passed left side)
    if ((keys["KeyA"] || keys["ArrowLeft"]) && !currentLevel.obstacles.some(obstacle => playerY + playerSize > obstacle.boundY.min && playerY < obstacle.boundY.max && playerX - horiVelo < obstacle.boundX.max && playerX > obstacle.boundX.min)) {
        playerX = Math.max(0, playerX - horiVelo);  // player can't leave canvas bounds
    }
    // move right if key is held, not at right canvas bound, no obstacle is in the way (no vertical overlap), obstacle left side within reach after moving, not passed right side)
    if ((keys["KeyD"] || keys["ArrowRight"]) && !currentLevel.obstacles.some(obstacle => playerY < obstacle.boundY.max && playerY > obstacle.boundY.min - playerSize && playerX + horiVelo > obstacle.boundX.min - playerSize && playerX < obstacle.boundX.max)) {
        playerX = Math.min(canvas.width - playerSize, playerX + horiVelo);  // same as above
    }
    if ((keys["KeyW"] || keys["ArrowUp"]) && !inAir) {  // jump into the air
        vertVelo = 20;
        inAir = true;
    }
    if (keys["KeyR"]) { // reset
        initPlayer();
    }
}

// this is where game updates (eg physics, level progression) will be calc'd
// (just so you know, calc is short for calculator)
function update() {
    // let the player move
    movement();

    // gravity!
    inAir = !checkAir();
    if (inAir) {
        vertVelo--;
        playerY-=vertVelo * updScale;
    } else {
        vertVelo = 0;
    }

    // check for level completion
    if (checkpoint() && levels.length != currentLevelIndex + 1) {
        currentLevelIndex++;
        currentLevel = levels[currentLevelIndex];
        initPlayer();
    } else if (levels.length === currentLevelIndex + 1) {
        ;
    }
}

// how can we see?? thank goodness for our handy draw function...
// this is how we can see our game
function draw() {
    // clean that canvas off so we can draw a new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw our player... jynxzi <3
    ctx.fillStyle = "red";
    ctx.fillRect(playerX, playerY, playerSize, playerSize);

    // draw the current level
    drawLevel();
}

// first initilization
initPlayer();

// time for the code to run
function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// init music
music.loop = true;
music.play();

gameLoop();
