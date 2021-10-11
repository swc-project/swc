"use strict";
var a = (this && this.__importDefault) || function(b) {
    return (b && b.a) ? b : {
        "default": b
    };
};
Object.defineProperty(exports, "a", {
    value: true
});
const c = a(require("./config.json"));
function d({ config =c.default  } = {
}) {
    function e(f) {
        const g = config[f] || null;
        if (!g) {
            return false;
        }
        const { available , availableBy  } = g;
        if (!availableBy) {
            return available;
        }
        return Date.now() >= availableBy && available;
    }
    function h(i) {
        const j = config[i] || null;
        return j;
    }
    return {
        b: h,
        c: e,
        d: config
    };
}
exports.default = d;
