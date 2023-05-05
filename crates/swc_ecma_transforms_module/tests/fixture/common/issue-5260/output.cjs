"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    a: function() {
        return _a.X;
    },
    b: function() {
        return _b.X;
    },
    c: function() {
        return _c.default;
    },
    d: function() {
        return _d.default;
    },
    e: function() {
        return _e;
    },
    f: function() {
        return _f;
    }
});
const _a = require("a");
const _b = require("b");
const _c = /*#__PURE__*/ _interop_require_default(require("c"));
const _d = /*#__PURE__*/ _interop_require_default(require("d"));
const _e = /*#__PURE__*/ _interop_require_wildcard(require("e"));
const _f = /*#__PURE__*/ _interop_require_wildcard(require("f"));
// unresolved
const x = X;
const _a1 = a;
const _c1 = c;
const _e1 = e;
// top level
const b = 1, d = 2, f = 3;
console.log(b, d, f);
