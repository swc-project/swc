export function Point(x, y) {
    var left, right;
    if (left = this, null != (right = Point) && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !right[Symbol.hasInstance](left) : !(left instanceof right)) return new Point(x, y);
    this.x = x, this.y = y;
}
export function magnitude(p) {
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
