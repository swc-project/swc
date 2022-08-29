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
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _a = /*#__PURE__*/ _interopRequireWildcard(require("./a"));
