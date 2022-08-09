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
function u({ config: n = t.default  } = {}) {
    function u(t) {
        const u = n[t] || null;
        if (!u) {
            return false;
        }
        const { available: e , availableBy: r  } = u;
        if (!r) {
            return e;
        }
        return Date.now() >= r && e;
    }
    function e(t) {
        const u = n[t] || null;
        return u;
    }
    return {
        longlong10: e,
        longlong2: u,
        longlong100: n
    };
}
exports.default = u;
