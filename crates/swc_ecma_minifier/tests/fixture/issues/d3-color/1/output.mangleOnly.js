import t, { extend as i } from "./define.js";
import { Color as e, rgbConvert as h, Rgb as n, darker as s, brighter as r } from "./color.js";
import { deg2rad as o, rad2deg as u } from "./math.js";
var l = -0.14861, a = +1.78277, c = -0.29227, f = -0.90649, p = +1.97294, b = p * f, x = p * a, $ = a * c - f * l;
function _(t) {
    if (t instanceof Cubehelix) return new Cubehelix(t.h, t.s, t.l, t.opacity);
    if (!(t instanceof n)) t = h(t);
    var i = t.r / 255, e = t.g / 255, s = t.b / 255, r = ($ * s + b * i - x * e) / ($ + b - x), o = s - r, l = (p * (e - r) - c * o) / f, a = Math.sqrt(l * l + o * o) / (p * r * (1 - r)), _ = a ? Math.atan2(l, o) * u - 120 : NaN;
    return new Cubehelix(_ < 0 ? _ + 360 : _, a, r, t.opacity);
}
export default function w(t, i, e, h) {
    return arguments.length === 1 ? _(t) : new Cubehelix(t, i, e, h == null ? 1 : h);
};
export function Cubehelix(t, i, e, h) {
    this.h = +t;
    this.s = +i;
    this.l = +e;
    this.opacity = +h;
}
t(Cubehelix, w, i(e, {
    brighter: function(t) {
        t = t == null ? r : Math.pow(r, t);
        return new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        t = t == null ? s : Math.pow(s, t);
        return new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * o, i = +this.l, e = isNaN(this.s) ? 0 : this.s * i * (1 - i), h = Math.cos(t), s = Math.sin(t);
        return new n(255 * (i + e * (l * h + a * s)), 255 * (i + e * (c * h + f * s)), 255 * (i + e * (p * h)), this.opacity);
    }
}));
