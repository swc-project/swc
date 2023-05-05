//// [exportAsNamespace_exportAssignment.ts]
"use strict";
//// [a.ts]
"use strict";
module.exports = {};
//// [b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ns", {
    enumerable: true,
    get: function() {
        return _a;
    }
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _a = /*#__PURE__*/ _interop_require_wildcard._(require("./a"));
