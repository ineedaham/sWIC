// interval class
export class Interval {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    contains(x) {   // x is included
        return this.min <= x && x <= this.max;
    }

    surrounds(x) {  // x is surrounded
        return this.min < x && x < this.max;
    }
}
