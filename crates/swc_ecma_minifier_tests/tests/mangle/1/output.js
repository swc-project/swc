"use strict";
var a = (this && this.__importDefault) || function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const c = a(require("./config.json"));
function b({ config: a = c.default  } = {}) {
    function b(e) {
        const b = a[e] || null;
        if (!b) {
            return false;
        }
        const { available: c , availableBy: d  } = b;
        if (!d) {
            return c;
        }
        return Date.now() >= d && c;
    }
    function d(b) {
        const c = a[b] || null;
        return c;
    }
    return {
        longlong10: d,
        longlong2: b,
        longlong100: a
    };
}
exports.default = b;
