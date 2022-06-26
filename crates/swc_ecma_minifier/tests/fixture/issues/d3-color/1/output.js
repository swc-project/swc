import define, { extend } from "./define.js";
import { Color, rgbConvert, Rgb, darker, brighter } from "./color.js";
import { deg2rad, rad2deg } from "./math.js";
var BC_DA = -0.5210501878999999 - 0.1347134789;
export default function cubehelix(h, s, l, opacity) {
    return 1 === arguments.length ? function(o) {
        if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
        o instanceof Rgb || (o = rgbConvert(o));
        var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + -1.7884503806 * r - 3.5172982438 * g) / (BC_DA + -1.7884503806 - 3.5172982438), bl = b - l, k = -((1.97294 * (g - l) - -0.29227 * bl) / 0.90649), s = Math.sqrt(k * k + bl * bl) / (1.97294 * l * (1 - l)), h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
        return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }(h) : new Cubehelix(h, s, l, null == opacity ? 1 : opacity);
};
export function Cubehelix(h, s, l, opacity) {
    this.h = +h, this.s = +s, this.l = +l, this.opacity = +opacity;
}
define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
        return k = null == k ? brighter : Math.pow(brighter, k), new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
        return k = null == k ? darker : Math.pow(darker, k), new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh = Math.cos(h), sinh = Math.sin(h);
        return new Rgb(255 * (l + a * (-0.14861 * cosh + 1.78277 * sinh)), 255 * (l + a * (-0.29227 * cosh + -0.90649 * sinh)), 255 * (l + a * (1.97294 * cosh)), this.opacity);
    }
}));
