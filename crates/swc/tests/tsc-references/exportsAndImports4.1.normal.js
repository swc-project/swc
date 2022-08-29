//// [exportsAndImports4.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _default = "hello";
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _t1 = /*#__PURE__*/ _interopRequireWildcard(require("./t1"));
var a = require("./t1");
a.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
//// [t3.ts]
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
    a: function() {
        return a;
    },
    b: function() {
        return _t1.default;
    },
    c: function() {
        return _t1;
    },
    d: function() {
        return _t1.default;
    },
    e1: function() {
        return _t1.default;
    },
    e2: function() {
        return _t1;
    },
    f1: function() {
        return _t1.default;
    },
    f2: function() {
        return _t1.default;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _t1 = /*#__PURE__*/ _interopRequireWildcard(require("./t1"));
var a = require("./t1");
a.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
_t1.default;
