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
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _0;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _0 = _interopRequireWildcard(require("./0"));
//// [11.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _0 = _interopRequireWildcard(require("./0")), _default = _0;
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default, _1 = _interopRequireDefault(require("./1")), _11 = _interopRequireDefault(require("./11"));
_1.default.a, _11.default.a, _1.default.b, _11.default.b;
