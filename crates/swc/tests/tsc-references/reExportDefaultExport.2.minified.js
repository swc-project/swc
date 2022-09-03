//// [reExportDefaultExport.ts]
"use strict";
//// [m1.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
function f() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
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
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _m1 = _interopRequireWildcard(require("./m1"));
(0, _m1.f)(), (0, _m1.default)();
