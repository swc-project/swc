"use strict";
var n = (this && this.__importDefault) || function(n) {
    return n && n.__esModule ? n : {
        default: n
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const t = n(require("./config.json"));
function e({ config: n = t.default  } = {}) {
    function e(t) {
        const e = n[t] || null;
        if (!e) {
            return false;
        }
        const { available: u , availableBy: r  } = e;
        if (!r) {
            return u;
        }
        return Date.now() >= r && u;
    }
    function u(t) {
        const e = n[t] || null;
        return e;
    }
    return {
        longlong10: u,
        longlong2: e,
        longlong100: n
    };
}
exports.default = e;
