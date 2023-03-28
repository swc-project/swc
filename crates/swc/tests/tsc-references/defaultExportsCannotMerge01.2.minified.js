//// [defaultExportsCannotMerge01.ts]
"use strict";
//// [m1.ts]
"use strict";
var Decl;
function Decl() {
    return 0;
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    Decl: function() {
        return Decl;
    },
    default: function() {
        return Decl;
    }
}), function(Decl) {
    Decl.x = 10, Decl.y = 20;
}(Decl || (Decl = {}));
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = (0, require("@swc/helpers/lib/_interop_require_default.js").default)(require("m1"));
(0, _m1.default)(), _m1.default.x, _m1.default.y;
