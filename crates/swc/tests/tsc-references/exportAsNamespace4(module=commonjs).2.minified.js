//// [0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    a: function() {
        return a;
    },
    b: function() {
        return b;
    }
});
var a = 1, b = 2;
//// [1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _0;
    }
});
var _0 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./0"));
//// [11.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
var _default = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./0"));
//// [2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _interop_require_default = require("@swc/helpers/_/_interop_require_default"), _1 = /*#__PURE__*/ _interop_require_default._(require("./1")), _11 = /*#__PURE__*/ _interop_require_default._(require("./11"));
_1.default.a, _11.default.a, _1.default.b, _11.default.b;
