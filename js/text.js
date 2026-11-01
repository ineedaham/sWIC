// this is where our text object will be

// text class
export class Text {
    constructor(text, x, y, size, font, color) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.font = font;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px ${this.font}`;
        ctx.fillText(this.text, this.x, this.y);
    }
}