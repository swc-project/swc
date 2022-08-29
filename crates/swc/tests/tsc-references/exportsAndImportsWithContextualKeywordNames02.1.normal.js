//// [exportsAndImportsWithContextualKeywordNames02.ts]
"use strict";
//// [t1.ts]
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
    return: function() {
        return as;
    },
    as: function() {
        return as;
    }
});
var as = 100;
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _t1 = /*#__PURE__*/ _interopRequireWildcard(require("./t1"));
var x = _t1.as;
var y = _t1.return;
//// [t3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
//// [t4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
