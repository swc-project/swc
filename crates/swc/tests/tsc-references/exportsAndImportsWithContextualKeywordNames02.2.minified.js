//// [exportsAndImportsWithContextualKeywordNames02.ts]
"use strict";
//// [t1.ts]
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
    value: !0
});
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _t1 = _interopRequireWildcard(require("./t1")), x = _t1.as, y = _t1.return;
//// [t3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
//// [t4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
