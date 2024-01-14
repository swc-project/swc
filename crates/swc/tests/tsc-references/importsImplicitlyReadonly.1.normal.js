//// [importsImplicitlyReadonly.ts]
"use strict";
//// [a.ts]
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
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
var x = 1;
var y = 1;
//// [b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _a = /*#__PURE__*/ _interop_require_wildcard._(require("./a"));
var a2 = require("./a");
var a3 = _a;
x = 1; // Error
y = 1; // Error
_a.x = 1; // Error
_a.y = 1; // Error
a2.x = 1;
a2.y = 1;
a3.x = 1;
a3.y = 1;
