import { _ as s } from "@swc/helpers/_/_instanceof";
import t, { extend as i } from "./define.js";
import { Color as h, rgbConvert as r, Rgb as n, darker as o, brighter as a } from "./color.js";
import { deg2rad as u, rad2deg as l } from "./math.js";
var c = -1.78277 * 0.29227 - 0.1347134789;
export default function e(t, h, e, i) {
    return 1 == arguments.length ? function(t) {
        if (s(t, Cubehelix)) return new Cubehelix(t.h, t.s, t.l, t.opacity);
        s(t, n) || (t = r(t));
        var f = t.r / 255, a = t.g / 255, u = t.b / 255, i = (c * u + -1.7884503806 * f - 3.5172982438 * a) / (c + -1.7884503806 - 3.5172982438), h = u - i, e = -((1.97294 * (a - i) - -0.29227 * h) / 0.90649), p = Math.sqrt(e * e + h * h) / (1.97294 * i * (1 - i)), o = p ? Math.atan2(e, h) * l - 120 : NaN;
        return new Cubehelix(o < 0 ? o + 360 : o, p, i, t.opacity);
    }(t) : new Cubehelix(t, h, e, null == i ? 1 : i);
}
export function Cubehelix(t, i, h, e) {
    this.h = +t, this.s = +i, this.l = +h, this.opacity = +e;
}
t(Cubehelix, e, i(h, {
    brighter: function(t) {
        return t = null == t ? a : Math.pow(a, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        return t = null == t ? o : Math.pow(o, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var e = isNaN(this.h) ? 0 : (this.h + 120) * u, t = +this.l, i = isNaN(this.s) ? 0 : this.s * t * (1 - t), h = Math.cos(e), s = Math.sin(e);
        return new n(255 * (t + i * (-0.14861 * h + 1.78277 * s)), 255 * (t + i * (-0.29227 * h + -0.90649 * s)), 255 * (t + 1.97294 * h * i), this.opacity);
    }
}));
