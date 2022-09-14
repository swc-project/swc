import t from "@swc/helpers/src/_instanceof.mjs";
import i, { extend as h } from "./define.js";
import { Color as e, rgbConvert as s, Rgb as r, darker as n, brighter as o } from "./color.js";
import { deg2rad as a, rad2deg as u } from "./math.js";
var l = -1.78277 * 0.29227 - 0.1347134789;
export default function c(i, h, e, n) {
    return 1 === arguments.length ? function(i) {
        if (t(i, Cubehelix)) return new Cubehelix(i.h, i.s, i.l, i.opacity);
        t(i, r) || (i = s(i));
        var h = i.r / 255, e = i.g / 255, n = i.b / 255, o = (l * n + -1.7884503806 * h - 3.5172982438 * e) / (l + -1.7884503806 - 3.5172982438), a = n - o, c = -((1.97294 * (e - o) - -0.29227 * a) / 0.90649), p = Math.sqrt(c * c + a * a) / (1.97294 * o * (1 - o)), f = p ? Math.atan2(c, a) * u - 120 : NaN;
        return new Cubehelix(f < 0 ? f + 360 : f, p, o, i.opacity);
    }(i) : new Cubehelix(i, h, e, null == n ? 1 : n);
}
export function Cubehelix(t, i, h, e) {
    this.h = +t, this.s = +i, this.l = +h, this.opacity = +e;
}
i(Cubehelix, c, h(e, {
    brighter: function(t) {
        return t = null == t ? o : Math.pow(o, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        return t = null == t ? n : Math.pow(n, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * a, i = +this.l, h = isNaN(this.s) ? 0 : this.s * i * (1 - i), e = Math.cos(t), s = Math.sin(t);
        return new r(255 * (i + h * (-0.14861 * e + 1.78277 * s)), 255 * (i + h * (-0.29227 * e + -0.90649 * s)), 255 * (i + h * (1.97294 * e)), this.opacity);
    }
}));
