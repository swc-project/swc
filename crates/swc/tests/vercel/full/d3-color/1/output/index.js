import { _ as t } from "@swc/helpers/_/_instanceof";
import i, { extend as h } from "./define.js";
import { Color as e, rgbConvert as s, Rgb as r, darker as n, brighter as o } from "./color.js";
import { deg2rad as a, rad2deg as u } from "./math.js";
var l = -1.78277 * 0.29227 - 0.1347134789;
export default function c(c, p, f, b) {
    return 1 == arguments.length ? function(i) {
        if (t(i, Cubehelix)) return new Cubehelix(i.h, i.s, i.l, i.opacity);
        t(i, r) || (i = s(i));
        var h = i.r / 255, e = i.g / 255, n = i.b / 255, o = (l * n + -1.7884503806 * h - 3.5172982438 * e) / (l + -1.7884503806 - 3.5172982438), a = n - o, c = -((1.97294 * (e - o) - -0.29227 * a) / 0.90649), p = Math.sqrt(c * c + a * a) / (1.97294 * o * (1 - o)), f = p ? Math.atan2(c, a) * u - 120 : NaN;
        return new Cubehelix(f < 0 ? f + 360 : f, p, o, i.opacity);
    }(c) : new Cubehelix(c, p, f, null == b ? 1 : b);
}
export function Cubehelix(l, c, p, f) {
    this.h = +l, this.s = +c, this.l = +p, this.opacity = +f;
}
i(Cubehelix, c, h(e, {
    brighter: function(l) {
        return l = null == l ? o : Math.pow(o, l), new Cubehelix(this.h, this.s, this.l * l, this.opacity);
    },
    darker: function(l) {
        return l = null == l ? n : Math.pow(n, l), new Cubehelix(this.h, this.s, this.l * l, this.opacity);
    },
    rgb: function() {
        var l = isNaN(this.h) ? 0 : (this.h + 120) * a, c = +this.l, p = isNaN(this.s) ? 0 : this.s * c * (1 - c), f = Math.cos(l), b = Math.sin(l);
        return new r(255 * (c + p * (-0.14861 * f + 1.78277 * b)), 255 * (c + p * (-0.29227 * f + -0.90649 * b)), 255 * (c + p * (1.97294 * f)), this.opacity);
    }
}));
