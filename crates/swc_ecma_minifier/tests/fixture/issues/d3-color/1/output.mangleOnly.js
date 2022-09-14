import t, { extend as i } from "./define.js";
import { Color as h, rgbConvert as e, Rgb as n, darker as s, brighter as r } from "./color.js";
import { deg2rad as o, rad2deg as a } from "./math.js";
var u = -0.14861, l = +1.78277, c = -0.29227, f = -0.90649, p = +1.97294, b = p * f, x = p * l, w = l * c - f * u;
function C(t) {
    if (t instanceof Cubehelix) return new Cubehelix(t.h, t.s, t.l, t.opacity);
    if (!(t instanceof n)) t = e(t);
    var i = t.r / 255, h = t.g / 255, s = t.b / 255, r = (w * s + b * i - x * h) / (w + b - x), o = s - r, u = (p * (h - r) - c * o) / f, l = Math.sqrt(u * u + o * o) / (p * r * (1 - r)), C = l ? Math.atan2(u, o) * a - 120 : NaN;
    return new Cubehelix(C < 0 ? C + 360 : C, l, r, t.opacity);
}
export default function m(t, i, h, e) {
    return arguments.length === 1 ? C(t) : new Cubehelix(t, i, h, e == null ? 1 : e);
}
export function Cubehelix(t, i, h, e) {
    this.h = +t;
    this.s = +i;
    this.l = +h;
    this.opacity = +e;
}
t(Cubehelix, m, i(h, {
    brighter: function(t) {
        t = t == null ? r : Math.pow(r, t);
        return new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        t = t == null ? s : Math.pow(s, t);
        return new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * o, i = +this.l, h = isNaN(this.s) ? 0 : this.s * i * (1 - i), e = Math.cos(t), s = Math.sin(t);
        return new n(255 * (i + h * (u * e + l * s)), 255 * (i + h * (c * e + f * s)), 255 * (i + h * (p * e)), this.opacity);
    }
}));
