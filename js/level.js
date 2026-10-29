// dependencies
import {
    Checkpoint
} from "./world.js";
import {
    addBounds
} from "./addBounds.js";

// level class
export class Level {
    constructor(canvas, obstacles) {
        this.obstacles = obstacles;
        this.checkpoint = new Checkpoint(canvas);
        addBounds(this, this.x, this.y, this.width, this.height);
    }
}
