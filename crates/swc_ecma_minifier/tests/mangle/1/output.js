"use strict";
var e = (this && this.__importDefault) || function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const n = e(require("./config.json"));
function t({ config: e = n.default } = {}) {
    function r(r) {
        const t = e[r] || null;
        if (!t) {
            return false;
        }
        const { available: u, availableBy: n } = t;
        if (!n) {
            return u;
        }
        return Date.now() >= n && u;
    }
    function u(t) {
        const n = e[t] || null;
        return n;
    }
    return {
        longlong10: u,
        longlong2: r,
        longlong100: e
    };
}
exports.default = t;
