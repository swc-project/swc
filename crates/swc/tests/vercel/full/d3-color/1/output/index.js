import "@swc/helpers/_/_instanceof";
import "./define.js";
import t from "./define.js";
import { extend as o } from "./define.js";
import "./color.js";
import { Color as r } from "./color.js";
import { Rgb as i } from "./color.js";
import { darker as s } from "./color.js";
import { brighter as h } from "./color.js";
import "./math.js";
import { deg2rad as n } from "./math.js";
t(f, c, o(r, {
    brighter: function(t) {
        return t = null == t ? h : Math.pow(h, t), new f(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function(t) {
        return t = null == t ? s : Math.pow(s, t), new f(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function() {
        var t = isNaN(this.h) ? 0 : (this.h + 120) * n, o = +this.l, r = isNaN(this.s) ? 0 : this.s * o * (1 - o), s = Math.cos(t), h = Math.sin(t);
        return new i(255 * (o + r * (-0.14861 * s + 1.78277 * h)), 255 * (o + r * (-0.29227 * s + -0.90649 * h)), 255 * (o + 1.97294 * s * r), this.opacity);
    }
}));
import { _ as e } from "@swc/helpers/_/_instanceof";
import { rgbConvert as a } from "./color.js";
import { Rgb as i } from "./color.js";
import { rad2deg as m } from "./math.js";
var p = -1.78277 * 0.29227 - 0.1347134789;
export default function c(t, o, r, s) {
    return 1 == arguments.length ? function(t) {
        if (e(t, f)) return new f(t.h, t.s, t.l, t.opacity);
        e(t, i) || (t = a(t));
        var o = t.r / 255, r = t.g / 255, s = t.b / 255, h = (p * s + -1.7884503806 * o - 3.5172982438 * r) / (p + -1.7884503806 - 3.5172982438), n = s - h, c = -((1.97294 * (r - h) - -0.29227 * n) / 0.90649), l = Math.sqrt(c * c + n * n) / (1.97294 * h * (1 - h)), u = l ? Math.atan2(c, n) * m - 120 : NaN;
        return new f(u < 0 ? u + 360 : u, l, h, t.opacity);
    }(t) : new f(t, o, r, null == s ? 1 : s);
}
function f(t, o, r, i) {
    this.h = +t, this.s = +o, this.l = +r, this.opacity = +i;
}
export { c as default, f as Cubehelix };
