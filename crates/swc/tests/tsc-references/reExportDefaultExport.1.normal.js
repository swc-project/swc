//// [reExportDefaultExport.ts]
"use strict";
//// [m1.ts]
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
    default: function() {
        return f;
    },
    f: function() {
        return f;
    }
});
function f() {}
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _m1 = /*#__PURE__*/ _interop_require_wildcard._(require("./m1"));
(0, _m1.f)();
(0, _m1.default)();
