// dependencies
import {
    Interval
} from "./interval.js";

// add bounds to every class
export function addBounds(object, x, y, width, height) {
    object.boundX = new Interval(x, x + width);
    object.boundY = new Interval(y, y + height);
}
