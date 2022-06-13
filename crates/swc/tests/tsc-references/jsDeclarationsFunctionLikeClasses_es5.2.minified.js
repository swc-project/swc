import _instanceof from "@swc/helpers/src/_instanceof.mjs";
export function Point(x, y) {
    if (!_instanceof(this, Point)) return new Point(x, y);
    this.x = x, this.y = y;
}
export function magnitude(p) {
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
