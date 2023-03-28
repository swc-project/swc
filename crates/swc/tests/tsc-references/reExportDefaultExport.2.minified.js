//// [reExportDefaultExport.ts]
"use strict";
//// [m1.ts]
"use strict";
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
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = (0, require("@swc/helpers/lib/_interop_require_wildcard.js").default)(require("./m1"));
(0, _m1.f)(), (0, _m1.default)();
