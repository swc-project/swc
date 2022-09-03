//// [exportAsNamespace_exportAssignment.ts]
"use strict";
//// [a.ts]
"use strict";
module.exports = {};
//// [b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ns", {
    enumerable: !0,
    get: function() {
        return _a;
    }
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _a = _interopRequireWildcard(require("./a"));
