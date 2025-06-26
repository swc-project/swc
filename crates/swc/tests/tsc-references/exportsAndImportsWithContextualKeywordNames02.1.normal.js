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
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get as () {
        return as;
    },
    get return () {
        return as;
    }
});
var as = 100;
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _t1 = /*#__PURE__*/ _interop_require_wildcard._(require("./t1"));
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
