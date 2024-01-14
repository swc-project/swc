//// [importsImplicitlyReadonly.ts]
//// [a.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
var x = 1, y = 1;
//// [b.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _a = require("@swc/helpers/_/_interop_require_wildcard")._(require("./a")), a2 = require("./a");
x = 1, y = 1, _a.x = 1, _a.y = 1, a2.x = 1, a2.y = 1, _a.x = 1, _a.y = 1;
