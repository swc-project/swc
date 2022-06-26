import a from "@swc/helpers/src/_instanceof.mjs";
import b, { extend as c } from "./define.js";
import { Color as d, rgbConvert as e, Rgb as f, darker as g, brighter as h } from "./color.js";
import { deg2rad as i, rad2deg as j } from "./math.js";
var k = -0.5210501878999999 - 0.1347134789;
export default function l(b, c, d, g) {
    return 1 === arguments.length ? function(b) {
        if (a(b, Cubehelix)) return new Cubehelix(b.h, b.s, b.l, b.opacity);
        a(b, f) || (b = e(b));
        var c = b.r / 255, d = b.g / 255, g = b.b / 255, h = (k * g + -1.7884503806 * c - 3.5172982438 * d) / (k + -1.7884503806 - 3.5172982438), i = g - h, l = -((1.97294 * (d - h) - -0.29227 * i) / 0.90649), m = Math.sqrt(l * l + i * i) / (1.97294 * h * (1 - h)), n = m ? Math.atan2(l, i) * j - 120 : NaN;
        return new Cubehelix(n < 0 ? n + 360 : n, m, h, b.opacity);
    }(b) : new Cubehelix(b, c, d, null == g ? 1 : g);
};
export function Cubehelix(a, b, c, d) {
    this.h = +a, this.s = +b, this.l = +c, this.opacity = +d;
}
b(Cubehelix, l, c(d, {
    brighter: function(a) {
        return a = null == a ? h : Math.pow(h, a), new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    darker: function(a) {
        return a = null == a ? g : Math.pow(g, a), new Cubehelix(this.h, this.s, this.l * a, this.opacity);
    },
    rgb: function() {
        var a = isNaN(this.h) ? 0 : (this.h + 120) * i, b = +this.l, c = isNaN(this.s) ? 0 : this.s * b * (1 - b), d = Math.cos(a), e = Math.sin(a);
        return new f(255 * (b + c * (-0.14861 * d + 1.78277 * e)), 255 * (b + c * (-0.29227 * d + -0.90649 * e)), 255 * (b + c * (1.97294 * d)), this.opacity);
    }
}));
