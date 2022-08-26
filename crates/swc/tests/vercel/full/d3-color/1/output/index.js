import t from "@swc/helpers/src/_instanceof.mjs";
import i, { extend as e } from "./define.js";
import { Color as h, rgbConvert as r, Rgb as s, darker as n, brighter as o } from "./color.js";
import { deg2rad as u, rad2deg as l } from "./math.js";
var $ = -1.78277 * 0.29227 - 0.1347134789;
export default function _(i, e, h, n) {
    return 1 === arguments.length ? function(i) {
        if (t(i, Cubehelix)) return new Cubehelix(i.h, i.s, i.l, i.opacity);
        t(i, s) || (i = r(i));
        var e = i.r / 255, h = i.g / 255, n = i.b / 255, o = ($ * n + -1.7884503806 * e - 3.5172982438 * h) / ($ + -1.7884503806 - 3.5172982438), u = n - o, _ = -((1.97294 * (h - o) - -0.29227 * u) / 0.90649), c = Math.sqrt(_ * _ + u * u) / (1.97294 * o * (1 - o)), a = c ? Math.atan2(_, u) * l - 120 : NaN;
        return new Cubehelix(a < 0 ? a + 360 : a, c, o, i.opacity);
    }(i) : new Cubehelix(i, e, h, null == n ? 1 : n);
};
export function Cubehelix(t, i, e, h) {
    this.h = +t, this.s = +i, this.l = +e, this.opacity = +h;
}
i(Cubehelix, _, e(h, {
    brighter: function(t) {
        return t = null == t ? o : Math.pow(o, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        return t = null == t ? n : Math.pow(n, t), new Cubehelix(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * u, i = +this.l, e = isNaN(this.s) ? 0 : this.s * i * (1 - i), h = Math.cos(t), r = Math.sin(t);
        return new s(255 * (i + e * (-0.14861 * h + 1.78277 * r)), 255 * (i + e * (-0.29227 * h + -0.90649 * r)), 255 * (i + e * (1.97294 * h)), this.opacity);
    }
}));
