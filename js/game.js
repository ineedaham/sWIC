// balright! it is time... to make the platformer!!! :3

// dependencies
import {
    Level
} from "./level.js";        // for creating levels
import {
    Obstacle
} from "./world.js";        // for creating obstacles
import {
    Key
} from "./world.js";        // for key properties
import {
    Text
} from "./text.js";         // for displaying text
import {
    addBounds
} from "./addBounds.js";    // for setting bounds of phase obstacles

// constant variables
const stopwatchText = new Text("0.00s", 20, 80, 30, "Arial", "black");  // text to display stopwatch
const playerImage   = new Image();                                      // player sprite
playerImage.src     = "assets/player.png";                             // set player sprite source image
const canvas        = document.getElementById("game");                  // here is the fabeled canvas!
const ctx           = canvas.getContext("2d");                          // get the context for our canvas. i am NOT making a 3d game
const keys          = {};                                               // keyboard input
const music         = new Audio("assets/song.wav");                     // beautiful song <3
const jump          = new Audio("assets/jump.wav");                     // jump sound
const boing         = new Audio("assets/boing.wav");                    // jump obstacle sound
const levels        = [];                                               // level data

// this is where we create levels
function level(obstacles, texts, keyCoords = []) {
    // create new level instance
    const level = new Level(canvas, obstacles, texts);
    // phase obstacles filtered
    const phase = level.obstacles.filter(obstacle => obstacle.phase);

    // generate keys: loop through each phase obstacle, and assign a key with unique coordinates to it with a matching index
    phase.forEach((phase, idx) => {
        const [x, y] = keyCoords[idx];
        level.keys.push(new Key(x, y, 25, 25));
    });

    return level;
}

/* level data */ {
    levels[0] = level([
        new Obstacle(200, 350, 150, 50, false, false, false),
        new Obstacle(350, 350, 100, 50, true, false, false),
        new Obstacle(450, 350, 150, 50, false, false, false),
    ], [
        new Text("Level 1", 20, 40, 30, "Arial", "black"),
        new Text("Lava - deadly", 312, 325, 30, "Arial", "black"),
    ], []);
    levels[1] = level([
        new Obstacle(150, 250, 50, 50, false, false, false),
        new Obstacle(300, 325, 50, 50, false, false, false),
        new Obstacle(300, 175, 50, 50, false, false, false),
        new Obstacle(375, 225, 50, 175, true, false, false),
    ], [
        new Text("Level 2", 20, 40, 30, "Arial", "black"),
    ], []);
    levels[2] = level([
        new Obstacle(300, 375, 50, 25, false, false, false),
        new Obstacle(400, 325, 50, 75, false, false, false),
        new Obstacle(500, 275, 50, 125, false, false, false),
        new Obstacle(600, 200, 50, 200, false, false, false),
    ], [
        new Text("Level 3", 20, 40, 30, "Arial", "black"),
    ], []);
    levels[3] = level([
        new Obstacle(0, 350, 250, 50, false, false, false),
        new Obstacle(250, 350, 100, 50, false, true, false),
        new Obstacle(350, 350, 100, 50, true, false, false),
    ], [
        new Text("Level 4", 20, 40, 30, "Arial", "black"),
        new Text("Jump obstacle", 200, 325, 30, "Arial", "black"),
    ], [])
    levels[4] = level([
        new Obstacle(200, 350, 100, 50, false, false, false),
        new Obstacle(500, 0, 50, 400, false, false, true),
        new Obstacle(0, 295, 200, 10, false, false, false),
        new Obstacle(200, 240, 125, 5, false, false, false),
        new Obstacle(325, 240, 50, 5, true, false, false),
        new Obstacle(375, 240, 125, 5, false, false, false),
        new Obstacle(200, 245, 300, 5, false, false, false),
        new Obstacle(450, 250, 50, 150, true, false, false)
    ], [
        new Text("Level 5", 20, 40, 30, "Arial", "black"),
        new Text("Key", 75, 373, 40, 30, "Arial", "black"),
        new Text("Phase obstacle", 575, 170, 40, 30, "Arial", "black"),
    ], [
        [25, 350],
    ]);
}

// variables
let currentLevelIndex = 0;
let currentLevel      = levels[currentLevelIndex];
let playerSize        = 40;     // defines how wide/tall the sprite is
let playerX;                    // player position
let playerY;                    // ^~~~~~~~~~~~~~^
let vertVelo;                   // vertical velocity
let updScale          = 0;      // vertical velocity update scale
let horiVelo          = 0;      // horizontal velocity magnitude
let inAir;                      // player is in the air
let stopwatchFrames   = 0;      // total frames elapsed
let stopwatchTime     = 0;      // total time elapsed
let stopwatchLastFrame;         // timestamp of last frame
let stopwatchDelta;             // time between previous and current frames
let refRate           = 0;      // display refresh rate
let paused            = false;  // stopwatch is paused

// initialize player
function initPlayer() {
    vertVelo = 0;
    playerX  = 50;
    playerY  = canvas.height - 4 * playerSize;
    inAir    = true;
    for (const key of currentLevel.keys) {  // reset level progress
        // player loses key
        key.collected = false;
        // validate bounds for phase obstacle, so player cannot pass through it, until they collect the key again
        currentLevel.obstacles.filter(obstacle => obstacle.phase).forEach(phase => {
            addBounds(phase, phase.x, phase.y, phase.width, phase.height);
        });
    }
}

// update stopwatch and recalculate refresh rate
function updWatch(timestamp) {
    if (stopwatchLastFrame !== undefined && !paused) {
        stopwatchDelta = timestamp - stopwatchLastFrame;
        stopwatchTime+= stopwatchDelta / 1000;
        stopwatchFrames++;

        // calculate refresh rate
        refRate = 1000 / stopwatchDelta;
    }
    stopwatchLastFrame = timestamp;
}

// listen for key events for our controls
document.addEventListener("keydown", function(event) {
    keys[event.code] = true;

    // keep the page from scrolling
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
    }

    // stop broken pausing
    if (event.repeat) {
        return;
    }

    // pause the game and stopwatch
    if (event.code === "KeyP") {
        paused = !paused;
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
    for (const key of currentLevel.keys) {
        key.draw(ctx);
    }
    currentLevel.checkpoint.draw(ctx);
}

// draw stopwatch
function drawWatch() {
    stopwatchText.text = stopwatchTime.toFixed(2) + "s";
    stopwatchText.draw(ctx);
}

// check for checkpoint reached
function checkpoint() {
    return (playerX + playerSize >= currentLevel.checkpoint.boundX.min && playerX <= currentLevel.checkpoint.boundX.max && playerY + playerSize >= currentLevel.checkpoint.boundY.min && playerY <= currentLevel.checkpoint.boundY.max);
}

// check for if player is in air
function checkAir() {
    if (vertVelo > 0) {     // if user hits obstacle on their top
        const hitObstacle = currentLevel.obstacles.find(obstacle => playerX + playerSize > obstacle.boundX.min && playerX < obstacle.boundX.max && playerY - vertVelo * updScale <= obstacle.boundY.max && playerY >= obstacle.boundY.max);
        if (hitObstacle) {  // stop user
            vertVelo = 0;
            playerY  = hitObstacle.boundY.max;
        }
    }

    if (vertVelo <= 0) {    // only check if player is falling or still
        // only look for an obstacle if player overlaps horizontally, player bottom is at or above the top, and player bottom will pass/reach the top this frame
        const hitObstacle = currentLevel.obstacles.find(obstacle => playerX + playerSize > obstacle.boundX.min && playerX < obstacle.boundX.max && playerY + playerSize <= obstacle.boundY.min && (playerY - vertVelo * updScale) + playerSize >= obstacle.boundY.min);
        if (hitObstacle) {  // on an obstacle
            playerY = hitObstacle.boundY.min - playerSize;
            return true;
        }
    }

    // check for if player will land on the ground
    if ((playerY - vertVelo * updScale) > canvas.height - playerSize) { // on the ground
        playerY = canvas.height - playerSize;
        return true;
    }

    return false;
}

// check if the player is touching an obstacle
function collisionNotBottom(type) {
    return currentLevel.obstacles.some(obstacle => obstacle[type] && playerX <= obstacle.boundX.max && playerX + playerSize >= obstacle.boundX.min && playerY <= obstacle.boundY.max && playerY + playerSize >= obstacle.boundY.min);
}

// check if the player is head colliding an obstacle
function allCollisions(type) {
    return currentLevel.obstacles.some(obstacle => obstacle[type] && playerX <= obstacle.boundX.max && playerX + playerSize >= obstacle.boundX.min && ((vertVelo > 0 && playerY >= obstacle.boundY.max && (playerY - vertVelo * updScale) <= obstacle.boundY.max) || (vertVelo <= 0 && playerY + playerSize <= obstacle.boundY.min && (playerY - vertVelo * updScale) + playerSize >= obstacle.boundY.min) || (playerY + playerSize > obstacle.boundY.min && playerY < obstacle.boundY.max)));
}

// check if the player has collected a key
function collectKey() {
    return currentLevel.keys.findIndex(key => playerX <= key.boundX.max && playerX + playerSize >= key.boundX.min && playerY <= key.boundY.max && playerY + playerSize >= key.boundY.min);
}

// deal with keyboard input for movement
function movement() {
    // move left if key is held, not at left canvas bound, no obstacle is in the way (no vertical overlap), obstacle right side within reach after moving, not passed left side)
    if (keys["KeyA"] || keys["ArrowLeft"]) {
        const hitObstacle = currentLevel.obstacles.find(obstacle => !obstacle.lava && playerY + playerSize > obstacle.boundY.min && playerY < obstacle.boundY.max && playerX - horiVelo < obstacle.boundX.max && playerX >= obstacle.boundX.max);
        if (hitObstacle) {  // player hit obstacle on left side
            playerX = hitObstacle.boundX.max;
        } else {
            playerX = Math.max(0, playerX - horiVelo);  // player can't leave canvas bounds
        }
    }
    // move right if key is held, not at right canvas bound, no obstacle is in the way (no vertical overlap), obstacle left side within reach after moving, not passed right side)
    if (keys["KeyD"] || keys["ArrowRight"]) {
        const hitObstacle = currentLevel.obstacles.find(obstacle => !obstacle.lava && playerY < obstacle.boundY.max && playerY > obstacle.boundY.min - playerSize && playerX + horiVelo > obstacle.boundX.min - playerSize && playerX + playerSize <= obstacle.boundX.min);
        if (hitObstacle) {  // player hit obstacle on right side
            playerX = hitObstacle.boundX.min - playerSize;
        } else {
            playerX = Math.min(canvas.width - playerSize, playerX + horiVelo);  // same as above
        }
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

    // get ready for possible key collection
    let keyIdx = collectKey();

    // gravity!
    inAir = !checkAir();
    if (inAir) {    // ACCELERATION!!!
        playerY-=vertVelo * updScale;
    } else {    // player is on the ground
        if (collisionNotBottom("jump")) {
            vertVelo = 30;  // bounce
            // play boing sound
            boing.currentTime = 0.0;
            boing.play();
        } else {
            vertVelo = 0;

        }
    }

    // update player movement values
    if (refRate > 0) {
        updScale = 30 / refRate;
        horiVelo = 5 * 60 / refRate;
        vertVelo = vertVelo - (60 / refRate);
    }

    // check for if player is touching lava
    if (allCollisions("lava")) { // reset player
        initPlayer();
    }
    if (keyIdx !== -1) {
        currentLevel.keys[keyIdx].collected = true;
        // delete bounds of phase obstacle, so player can pass through it
        addBounds(currentLevel.obstacles.filter(obstacle => obstacle.phase)[keyIdx], 0, 0, 0, 0);
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

    // draw the stopwatch
    drawWatch();
}

// time for the code to run
function gameLoop(timestamp) {
    // update stopwatch
    updWatch(timestamp);

    // update and draw game
    if (!paused) {
        update();
        draw();
    }

    requestAnimationFrame(gameLoop);
}



// init music
music.loop = true;
music.play();

// init player for drawing
initPlayer();

requestAnimationFrame(gameLoop);
