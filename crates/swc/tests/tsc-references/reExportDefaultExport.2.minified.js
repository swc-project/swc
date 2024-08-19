//// [reExportDefaultExport.ts]
//// [m1.ts]
function f() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    default: function() {
        return f;
    },
    f: function() {
        return f;
    }
});
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./m1"));
(0, _m1.f)(), (0, _m1.default)();
