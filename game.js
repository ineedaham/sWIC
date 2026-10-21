// balright! it is time... to make the platformer!!! :3

// constant variables
const canvas = document.getElementById("game"); // here is the fabeled canvas!
const ctx = canvas.getContext("2d");    // get the context for our canvas. i am NOT making a 3d game

// variables - might as well define the starting values now
let playerX = 50;
let playerY = 50;
let playerSize = 40;    // defines how wide/tall the sprite is

// this is where game updates (eg physics) will be calc'd
// (just so you know, calc is short for calculator)
function update() {
    // later
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
}

// time for the code to run
function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
