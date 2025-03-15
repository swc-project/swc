import { _ as t } from "@swc/helpers/_/_instanceof";
import i, { extend as h } from "./define.js";
import { Color as e, rgbConvert as s, Rgb as r, darker as n, brighter as o } from "./color.js";
import { deg2rad as a, rad2deg as u } from "./math.js";
var l = -0.14861, c = +1.78277, p = -0.29227, f = -0.90649, b = +1.97294, x = b * f, m = b * c, w = c * p - f * l;
export default function C(i, h, e, n) {
    return 1 == arguments.length ? function(i) {
        if (t(i, Cubehelix)) return new Cubehelix(i.h, i.s, i.l, i.opacity);
        t(i, r) || (i = s(i));
        var h = i.r / 255, e = i.g / 255, n = i.b / 255, o = (w * n + x * h - m * e) / (w + x - m), a = n - o, l = (b * (e - o) - p * a) / f, c = Math.sqrt(l * l + a * a) / (b * o * (1 - o)), C = c ? Math.atan2(l, a) * u - 120 : NaN;
        return new Cubehelix(C < 0 ? C + 360 : C, c, o, i.opacity);
    }(i) : new Cubehelix(i, h, e, null == n ? 1 : n);
}
export function Cubehelix(t, i, h, e) {
    this.h = +t, this.s = +i, this.l = +h, this.opacity = +e;
}
i(Cubehelix, C, h(e, {
    brighter: function(t) {
        return t = null == t ? o : Math.pow(o, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        return t = null == t ? n : Math.pow(n, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * a, i = +this.l, h = isNaN(this.s) ? 0 : this.s * i * (1 - i), e = Math.cos(t), s = Math.sin(t);
        return new r(255 * (i + h * (l * e + c * s)), 255 * (i + h * (p * e + f * s)), 255 * (i + b * e * h), this.opacity);
    }
}));
