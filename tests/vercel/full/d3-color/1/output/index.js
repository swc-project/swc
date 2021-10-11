import * as a from "@swc/helpers";
import b, { extend as c } from "./define.js";
import { Color as d, rgbConvert as e, Rgb as f, darker as g, brighter as h } from "./color.js";
import { deg2rad as i, rad2deg as j } from "./math.js";
var k = -0.5210501878999999 - 0.1347134789;
export default function cubehelix(l, m, n, o) {
    return 1 === arguments.length ? (function(p) {
        if (a._instanceof(p, Cubehelix)) return new Cubehelix(p.h, p.s, p.l, p.opacity);
        a._instanceof(p, f) || (p = e(p));
        var q = p.r / 255, r = p.g / 255, s = p.b / 255, t = (k * s + -1.7884503806 * q - 3.5172982438 * r) / (k + -1.7884503806 - 3.5172982438), u = s - t, v = -((1.97294 * (r - t) - -0.29227 * u) / 0.90649), w = Math.sqrt(v * v + u * u) / (1.97294 * t * (1 - t)), x = w ? Math.atan2(v, u) * j - 120 : NaN;
        return new Cubehelix(x < 0 ? x + 360 : x, w, t, p.opacity);
    })(l) : new Cubehelix(l, m, n, null == o ? 1 : o);
};
export function Cubehelix(y, z, A, B) {
    this.h = +y, this.s = +z, this.l = +A, this.opacity = +B;
}
b(Cubehelix, cubehelix, c(d, {
    brighter: function(C) {
        return C = null == C ? h : Math.pow(h, C), new Cubehelix(this.h, this.s, this.l * C, this.opacity);
    },
    darker: function(D) {
        return D = null == D ? g : Math.pow(g, D), new Cubehelix(this.h, this.s, this.l * D, this.opacity);
    },
    rgb: function() {
        var E = isNaN(this.h) ? 0 : (this.h + 120) * i, F = +this.l, G = isNaN(this.s) ? 0 : this.s * F * (1 - F), H = Math.cos(E), I = Math.sin(E);
        return new f(255 * (F + G * (-0.14861 * H + 1.78277 * I)), 255 * (F + G * (-0.29227 * H + -0.90649 * I)), 255 * (F + G * (1.97294 * H)), this.opacity);
    }
}));
