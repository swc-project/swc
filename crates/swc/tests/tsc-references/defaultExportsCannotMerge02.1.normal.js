//// [defaultExportsCannotMerge02.ts]
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
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var Decl = function Decl() {
    "use strict";
    _class_call_check._(this, Decl);
};
(function(Decl) {})(Decl || (Decl = {}));
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
var z = new _m1.default();
var sum = z.p1 + z.p2;
