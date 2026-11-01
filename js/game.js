// balright! it is time... to make the platformer!!! :3

// dependencies
import {
    Level
} from "./level.js";    // for creating levels
import {
    Obstacle
} from "./world.js";    // for creating obstacles
import {
    Text
} from "./text.js";     // for displaying text

// constant variables
const playerImage = new Image();                        // player sprite
playerImage.src   = "/assets/player.png";               // set player sprite source image
const canvas      = document.getElementById("game");    // here is the fabeled canvas!
const ctx         = canvas.getContext("2d");            // get the context for our canvas. i am NOT making a 3d game
const keys        = {};                                 // keyboard input
const music       = new Audio("assets/song.wav");       // beautiful song <3
const jump        = new Audio("assets/jump.wav");       // jump sound
const boing       = new Audio("assets/boing.wav");      // jump obstacle sound
const levels      = [                                   // level data - i need to move this somewhere else
    new Level(canvas, [
        new Obstacle(200, 350, 150, 50, false, false),
        new Obstacle(350, 350, 100, 50, true, false),
        new Obstacle(450, 350, 150, 50, false, false),
    ], [
        new Text("Level 1", 20, 40, 30, "Arial", "black"),
        new Text("Lava - deadly", 312, 325, 30, "Arial", "black"),
    ]),
    new Level(canvas, [
        new Obstacle(150, 250, 50, 50, false, false),
        new Obstacle(300, 325, 50, 50, false, false),
        new Obstacle(300, 175, 50, 50, false, false),
        new Obstacle(375, 225, 50, 175, true, false),
    ], [
        new Text("Level 2", 20, 40, 30, "Arial", "black"),
    ]),
    new Level (canvas, [
        new Obstacle(300, 375, 50, 25, false, false),
        new Obstacle(400, 325, 50, 75, false, false),
        new Obstacle(500, 275, 50, 125, false, false),
        new Obstacle(600, 200, 50, 200, false, false),
    ], [
        new Text("Level 3", 20, 40, 30, "Arial", "black"),
    ]),
    new Level (canvas, [
        new Obstacle(0, 350, 250, 50, false, false),
        new Obstacle(250, 350, 100, 50, false, true),
        new Obstacle(350, 350, 100, 50, true, false),
    ], [
        new Text("Level 4", 20, 40, 30, "Arial", "black"),
        new Text("Jump obstacle", 200, 325, 30, "Arial", "black"),
    ])
];

// variables
let playerSize = 40;    // defines how wide/tall the sprite is
let playerX;            // player position
let playerY;            // ^~~~~~~~~~~~~~^
let vertVelo;           // vertical velocity
let vertStep = 1;       // step of velocity
let updScale = 0.5;     // vertical velocity update scale
let horiVelo = 5;       // horizontal velocity magnitude
let inAir;              // player is in the air
let currentLevelIndex = 3;
let currentLevel = levels[currentLevelIndex];

// initialize player
function initPlayer() {
    vertVelo = 0;
    playerX  = 50;
    playerY  = canvas.height - 4 * playerSize;
    inAir    = true;
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

// this is where we can draw the player sprite
function drawPlayer() {
    // check if the player sprite is fully loaded
    if (playerImage.complete) { // draw the player sprite
        ctx.drawImage(playerImage, playerX, playerY, playerSize, playerSize);
    }
}

// draw levels
function drawLevel() {
    for (const obstacle of currentLevel.obstacles) {    // draw obstacles
        obstacle.draw(ctx);
    }
    for (const text of currentLevel.texts) {
        text.draw(ctx);
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
            vertVelo = 0;
            playerY  = hitObstacle.boundY.max;
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

// this is where we will check if the player is touching lava
function touchingLava() {
    return currentLevel.obstacles.some(obstacle => obstacle.lava && playerX <= obstacle.boundX.max && playerX + playerSize >= obstacle.boundX.min && playerY <= obstacle.boundY.max && playerY + playerSize >= obstacle.boundY.min);
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
        inAir    = true;
        // play jump sound
        jump.currentTime = 0.0;
        jump.play();
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
    if (inAir) {    // ACCELERATION!!!
        vertVelo--;
        playerY-=vertVelo * updScale;
    } else {    // player is on the ground
        if (currentLevel.obstacles.find(obstacle => obstacle.jump && playerX + playerSize > obstacle.boundX.min && playerX < obstacle.boundX.max && playerY + playerSize <= obstacle.boundY.min && playerY + playerSize - vertVelo * updScale <= obstacle.boundY.min)) {
            vertVelo = 30;  // bounce
            // play boing sound
            boing.currentTime = 0.0;
            boing.play();
        } else {
            vertVelo = 0;

        }
    }

    // check for if player is touching lava
    if (touchingLava()) {   // reset player
        initPlayer();
    }

    // check for level completion
    if (checkpoint() && levels.length != currentLevelIndex + 1) {
        currentLevelIndex++;
        currentLevel = levels[currentLevelIndex];
        initPlayer();
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
    drawPlayer();

    // draw the current level
    drawLevel();
}

// time for the code to run
function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// init music
music.loop = true;
music.play();

// init player for drawing
initPlayer();

gameLoop();
