//// [0.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    a: function() {
        return a;
    },
    b: function() {
        return b;
    }
});
var a = 1, b = 2;
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ns", {
    enumerable: !0,
    get: function() {
        return _0;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _0 = _interopRequireWildcard(require("./0"));
ns.a, ns.b;
var ns = {
    a: 1,
    b: 2
};
ns.a, ns.b;
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _1 = _interopRequireWildcard(require("./1"));
_1.ns.a, _1.ns.b;
