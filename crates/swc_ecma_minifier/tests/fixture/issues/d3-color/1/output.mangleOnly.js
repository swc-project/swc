import a, { extend as b } from "./define.js";
import { Color as c, rgbConvert as d, Rgb as e, darker as f, brighter as g } from "./color.js";
import { deg2rad as h, rad2deg as i } from "./math.js";
var j = -0.14861, k = +1.78277, l = -0.29227, m = -0.90649, n = +1.97294, o = n * m, p = n * k, q = k * l - m * j;
function r(a) {
    if (a instanceof Cubehelix) return new Cubehelix(a.h, a.s, a.l, a.opacity);
    if (!(a instanceof e)) a = d(a);
    var b = a.r / 255, c = a.g / 255, f = a.b / 255, g = (q * f + o * b - p * c) / (q + o - p), h = f - g, j = (n * (c - g) - l * h) / m, k = Math.sqrt(j * j + h * h) / (n * g * (1 - g)), r = k ? Math.atan2(j, h) * i - 120 : NaN;
    return new Cubehelix(r < 0 ? r + 360 : r, k, g, a.opacity);
}
export default function s(a, b, c, d) {
    return arguments.length === 1 ? r(a) : new Cubehelix(a, b, c, d == null ? 1 : d);
};
export function Cubehelix(a, b, c, d) {
    this.h = +a;
    this.s = +b;
    this.l = +c;
    this.opacity = +d;
}
a(Cubehelix, s, b(c, {
    brighter: function(a) {
        a = a == null ? g : Math.pow(g, a);
        return new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    darker: function(a) {
        a = a == null ? f : Math.pow(f, a);
        return new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    rgb: function() {
        var a = isNaN(this.h) ? 0 : (this.h + 120) * h, b = +this.l, c = isNaN(this.s) ? 0 : this.s * b * (1 - b), d = Math.cos(a), f = Math.sin(a);
        return new e(255 * (b + c * (j * d + k * f)), 255 * (b + c * (l * d + m * f)), 255 * (b + c * (n * d)), this.opacity);
    }
}));
