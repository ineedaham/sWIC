// balright! it is time... to make the platformer!!! :3

// get level data
import {
    Level, Obstacle
} from "./world.js";

// constant variables
const canvas = document.getElementById("game"); // here is the fabeled canvas!
const ctx = canvas.getContext("2d");    // get the context for our canvas. i am NOT making a 3d game
const keys = {};    // keyboard input
const levels = [    // level data
    new Level(canvas, [
        new Obstacle(200, 390, 30, 60),
        new Obstacle(350, 360, 40, 90),
    ])
];

// variables
let playerSize = 40;    // defines how wide/tall the sprite is
let playerX = 50;                               // player position
let playerY = canvas.height - 2 * playerSize;   // ^~~~~~~~~~~~~~^
let vertVelo = 0;   // vertical velocity
let inAir = false;  // player is in the air
let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

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

// check for if player is in air
// function checkAir() {
//     return (
//         playerY - vertVelo * 0.5 < canvas.height - playerSize ||
//         playerY - 
//     );
// }

// this is where we will deal with keyboard input for movement
function movement() {
    if ((keys["KeyA"] || keys["ArrowLeft"]) && playerX > 0) {
        playerX-=5;
    };
    if ((keys["KeyD"] || keys["ArrowRight"]) && playerX < canvas.width - playerSize) {
        playerX+=5;
    };
    if ((keys["KeyW"] || keys["ArrowUp"]) && !inAir) {
        vertVelo = 20;
        inAir = true;
    };
}

// this is where game updates (eg physics) will be calc'd
// (just so you know, calc is short for calculator)
function update() {
    // let the player move
    movement();

    // gravity!
    if (playerY - vertVelo * 0.5 < canvas.height - playerSize) {
        playerY-=vertVelo * 0.5;
    } else {
        inAir = false;
    }

    // update vertical velocity
    vertVelo--;
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

// time for the code to run
function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
