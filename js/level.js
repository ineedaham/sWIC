// dependencies
import {
    Checkpoint
} from "./world.js";
import {
    addBounds
} from "./addBounds.js";

// level class
export class Level {
    constructor(canvas, obstacles, texts) {
        this.obstacles = obstacles;
        this.checkpoint = new Checkpoint(canvas);
        this.texts = texts;
        addBounds(this, this.x, this.y, this.width, this.height);
    }
}
