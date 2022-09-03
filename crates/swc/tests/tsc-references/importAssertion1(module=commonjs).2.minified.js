//// [importAssertion1.ts]
"use strict";
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
    a: ()=>a,
    b: ()=>b
});
const a = 1, b = 2;
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _0 = _interopRequireWildcard(require("./0"));
_0.a, _0.b, _0.a, _0.b;
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _0 = require("./0");
_0.a, _0.b, _0.a, _0.b;
//// [3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, a = Promise.resolve().then(()=>_interopRequireWildcard(require("./0"))), b = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {
            type: "json"
        }
    }))), c = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {
            type: "json",
            ttype: "typo"
        }
    }))), d = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {}
    }))), dd = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {}))), e = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", foo()))), f = Promise.resolve().then((p)=>_interopRequireWildcard(require(p))), g = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {}, {}))), h = Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {
            type: "json"
        }
    })));
