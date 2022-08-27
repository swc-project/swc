//// [exportsAndImportsWithContextualKeywordNames02.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
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
var _t1 = (0, require("@swc/helpers/lib/_interop_require_wildcard.js").default)(require("./t1"));
_t1.as, _t1.return;
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
