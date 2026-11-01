// this is where world object properties are declared

// dependencies
import {
    addBounds
} from "./addBounds.js";

// obstacle class
export class Obstacle {
    constructor(x, y, width, height, lava) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lava = lava;
        addBounds(this, this.x, this.y, this.width, this.height);
    }

    draw(ctx) {
        if (this.lava) {
            ctx.fillStyle = "orange";
        } else {
            ctx.fillStyle = "black";
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// checkpoint class
export class Checkpoint {
    constructor(canvas) {
        this.x = canvas.width - 50;
        this.y = canvas.height - 50;
        this.width = 50;
        this.height = 50;
        addBounds(this, this.x, this.y, this.width, this.height);
    }

    draw(ctx) {
        ctx.fillStyle = "gold";
        ctx.fillRect(this.x, this.y, 25, 25);
    }
}
