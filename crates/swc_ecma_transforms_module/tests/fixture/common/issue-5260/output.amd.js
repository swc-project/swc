define([
    "require",
    "exports",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
], function(require, exports, _a, _b, _c, _d, _e, _f) {
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
        a: ()=>_a.X,
        b: ()=>_b.X,
        c: ()=>_c.default,
        d: ()=>_d.default,
        e: ()=>_e,
        f: ()=>_f
    });
    _c = /*#__PURE__*/ _interop_require_default(_c);
    _d = /*#__PURE__*/ _interop_require_default(_d);
    _e = /*#__PURE__*/ _interop_require_wildcard(_e);
    _f = /*#__PURE__*/ _interop_require_wildcard(_f);
    // unresolved
    const x = X;
    const _a1 = a;
    const _c1 = c;
    const _e1 = e;
    // top level
    const b = 1, d = 2, f = 3;
    console.log(b, d, f);
});
