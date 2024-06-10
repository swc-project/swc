"use strict";
var t = (this && this.__importDefault) || function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const e = t(require("./config.json"));
function n({ config: t = e.default } = {}) {
    function r(e) {
        const n = t[e] || null;
        if (!n) {
            return false;
        }
        const { available: r, availableBy: u } = n;
        if (!u) {
            return r;
        }
        return Date.now() >= u && r;
    }
    function u(e) {
        const n = t[e] || null;
        return n;
    }
    return {
        longlong10: u,
        longlong2: r,
        longlong100: t
    };
}
exports.default = n;
