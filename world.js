// obstacle class
export class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// checkpoint class
export class Checkpoint {
    constructor(canvas) {
        this.x = canvas.width - 50;
        this.y = canvas.height - 50;
    }

    draw(ctx) {
        ctx.fillStyle = "gold";
        ctx.fillRect(this.x, this.y, 25, 25);
    }
}

// level class
export class Level {
    constructor(canvas, obstacles) {
        this.obstacles = obstacles;
        this.checkpoint = new Checkpoint(canvas);
    }
}
