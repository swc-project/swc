//// [reExportDefaultExport.ts]
//// [m1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    default: function() {
        return f;
    },
    f: function() {
        return f;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
function f() {}
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./m1"));
(0, _m1.f)(), (0, _m1.default)();
