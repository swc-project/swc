//// [defaultExportsCannotMerge01.ts]
//// [m1.ts]
var Decl, x, y;
function Decl1() {
    return 0;
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return Decl1;
    }
}), Decl = Decl1 || (Decl1 = {}), x = 10, Object.defineProperty(Decl, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), y = 20, Object.defineProperty(Decl, "y", {
    enumerable: !0,
    get: function() {
        return y;
    },
    set: function(v) {
        y = v;
    }
});
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("m1"));
(0, _m1.default)(), _m1.default.x, _m1.default.y;
