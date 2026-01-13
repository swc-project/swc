//// [defaultExportsCannotMerge01.ts]
"use strict";
//// [m1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Decl () {
        return Decl;
    },
    get default () {
        return Decl;
    }
});
function Decl() {
    return 0;
}
(function(Decl) {
    Decl.x = 10;
    Decl.y = 20;
})(Decl || (Decl = {}));
var Decl;
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_default = require("@swc/helpers/_/_interop_require_default");
var _m1 = /*#__PURE__*/ _interop_require_default._(require("m1"));
(0, _m1.default)();
var x;
var y;
_m1.default.x;
_m1.default.y;
