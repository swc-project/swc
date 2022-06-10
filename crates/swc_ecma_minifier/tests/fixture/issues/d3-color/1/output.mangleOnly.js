import d, { extend as e } from "./define.js";
import { Color as f, rgbConvert as j, Rgb as k, darker as l, brighter as m } from "./color.js";
import { deg2rad as n, rad2deg as o } from "./math.js";
var g = -0.14861, a = +1.78277, h = -0.29227, b = -0.90649, c = +1.97294, p = c * b, q = c * a, r = a * h - b * g;
function s(a) {
    if (a instanceof Cubehelix) return new Cubehelix(a.h, a.s, a.l, a.opacity);
    if (!(a instanceof k)) a = j(a);
    var n = a.r / 255, i = a.g / 255, l = a.b / 255, d = (r * l + p * n - q * i) / (r + p - q), e = l - d, f = (c * (i - d) - h * e) / b, m = Math.sqrt(f * f + e * e) / (c * d * (1 - d)), g = m ? Math.atan2(f, e) * o - 120 : NaN;
    return new Cubehelix(g < 0 ? g + 360 : g, m, d, a.opacity);
}
export default function i(a, c, d, b) {
    return arguments.length === 1 ? s(a) : new Cubehelix(a, c, d, b == null ? 1 : b);
};
export function Cubehelix(a, b, c, d) {
    this.h = +a;
    this.s = +b;
    this.l = +c;
    this.opacity = +d;
}
d(Cubehelix, i, e(f, {
    brighter: function(a) {
        a = a == null ? m : Math.pow(m, a);
        return new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    darker: function(a) {
        a = a == null ? l : Math.pow(l, a);
        return new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    rgb: function() {
        var i = isNaN(this.h) ? 0 : (this.h + 120) * n, d = +this.l, e = isNaN(this.s) ? 0 : this.s * d * (1 - d), f = Math.cos(i), j = Math.sin(i);
        return new k(255 * (d + e * (g * f + a * j)), 255 * (d + e * (h * f + b * j)), 255 * (d + e * (c * f)), this.opacity);
    }
}));
