import { _ as t } from "@swc/helpers/_/_instanceof";
import i, { extend as h } from "./define.js";
import { Color as e, rgbConvert as s, Rgb as r, darker as n, brighter as o } from "./color.js";
import { deg2rad as a, rad2deg as u } from "./math.js";
var l = -1.7884503806, c = 3.5172982438, p = -1.78277 * 0.29227 - 0.1347134789;
export default function f(i, h, e, n) {
    return 1 == arguments.length ? function(i) {
        if (t(i, Cubehelix)) return new Cubehelix(i.h, i.s, i.l, i.opacity);
        t(i, r) || (i = s(i));
        var h = i.r / 255, e = i.g / 255, n = i.b / 255, o = (p * n + l * h - c * e) / (p + l - c), a = n - o, f = -((1.97294 * (e - o) - -0.29227 * a) / 0.90649), b = Math.sqrt(f * f + a * a) / (1.97294 * o * (1 - o)), x = b ? Math.atan2(f, a) * u - 120 : NaN;
        return new Cubehelix(x < 0 ? x + 360 : x, b, o, i.opacity);
    }(i) : new Cubehelix(i, h, e, null == n ? 1 : n);
}
export function Cubehelix(t, i, h, e) {
    this.h = +t, this.s = +i, this.l = +h, this.opacity = +e;
}
i(Cubehelix, f, h(e, {
    brighter: function(t) {
        return t = null == t ? o : Math.pow(o, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        return t = null == t ? n : Math.pow(n, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * a, i = +this.l, h = isNaN(this.s) ? 0 : this.s * i * (1 - i), e = Math.cos(t), s = Math.sin(t);
        return new r(255 * (i + h * (-0.14861 * e + 1.78277 * s)), 255 * (i + h * (-0.29227 * e + -0.90649 * s)), 255 * (i + 1.97294 * e * h), this.opacity);
    }
}));
