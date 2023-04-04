//// [source.js]
/**
 * @param {number} x
 * @param {number} y
 */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
export function Point(x, y) {
    if (!_instanceof(this, Point)) {
        return new Point(x, y);
    }
    this.x = x;
    this.y = y;
}
//// [referencer.js]
/**
 * @param {Point} p
 */ export function magnitude(p) {
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
