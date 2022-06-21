"use strict";
var a = (this && this.__importDefault) || function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const b = a(require("./config.json"));
function c({ config: a = b.default  } = {}) {
    function c(b) {
        const c = a[b] || null;
        if (!c) {
            return false;
        }
        const { available: d , availableBy: e  } = c;
        if (!e) {
            return d;
        }
        return Date.now() >= e && d;
    }
    function d(b) {
        const c = a[b] || null;
        return c;
    }
    return {
        longlong10: d,
        longlong2: c,
        longlong100: a
    };
}
exports.default = c;
