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
        get: all[name]
    });
}
_export(exports, {
    Decl: function() {
        return Decl;
    },
    default: function() {
        return Decl;
    }
});
function Decl() {
    return 0;
}
var Decl;
(function(Decl) {
    var x = Decl.x = 10;
    var y = Decl.y = 20;
})(Decl || (Decl = {}));
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _m1 = /*#__PURE__*/ _interopRequireDefault(require("m1"));
(0, _m1.default)();
var x;
var y;
_m1.default.x;
_m1.default.y;
