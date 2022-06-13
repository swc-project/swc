import e from "@swc/helpers/src/_instanceof.mjs";
import a, { extend as b } from "./define.js";
import { Color as c, rgbConvert as f, Rgb as g, darker as h, brighter as i } from "./color.js";
import { deg2rad as j, rad2deg as k } from "./math.js";
var l = -0.5210501878999999 - 0.1347134789;
export default function d(a, c, d, b) {
    return 1 === arguments.length ? function(a) {
        if (e(a, Cubehelix)) return new Cubehelix(a.h, a.s, a.l, a.opacity);
        e(a, g) || (a = f(a));
        var n = a.r / 255, i = a.g / 255, j = a.b / 255, b = (l * j + -1.7884503806 * n - 3.5172982438 * i) / (l + -1.7884503806 - 3.5172982438), c = j - b, d = -((1.97294 * (i - b) - -0.29227 * c) / 0.90649), m = Math.sqrt(d * d + c * c) / (1.97294 * b * (1 - b)), h = m ? Math.atan2(d, c) * k - 120 : NaN;
        return new Cubehelix(h < 0 ? h + 360 : h, m, b, a.opacity);
    }(a) : new Cubehelix(a, c, d, null == b ? 1 : b);
};
export function Cubehelix(a, b, c, d) {
    this.h = +a, this.s = +b, this.l = +c, this.opacity = +d;
}
a(Cubehelix, d, b(c, {
    brighter: function(a) {
        return a = null == a ? i : Math.pow(i, a), new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    darker: function(a) {
        return a = null == a ? h : Math.pow(h, a), new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    rgb: function() {
        var d = isNaN(this.h) ? 0 : (this.h + 120) * j, a = +this.l, b = isNaN(this.s) ? 0 : this.s * a * (1 - a), c = Math.cos(d), e = Math.sin(d);
        return new g(255 * (a + b * (-0.14861 * c + 1.78277 * e)), 255 * (a + b * (-0.29227 * c + -0.90649 * e)), 255 * (a + b * (1.97294 * c)), this.opacity);
    }
}));
