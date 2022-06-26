import _instanceof from "@swc/helpers/src/_instanceof.mjs";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: source.js
/**
 * @param {number} x
 * @param {number} y
 */ export function Point(x, y) {
    if (!_instanceof(this, Point)) {
        return new Point(x, y);
    }
    this.x = x;
    this.y = y;
}
/**
 * @param {Point} p
 */ export function magnitude(p) {
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
