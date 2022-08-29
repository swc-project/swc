//// [importAssertion1.ts]
"use strict";
//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
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
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>_interopRequireWildcard(require("./0"))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {
            type: "json"
        }
    }))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {
            type: "json",
            ttype: "typo"
        }
    }))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {}
    }))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {}))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", foo()))), Promise.resolve().then((p)=>_interopRequireWildcard(require(p))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {}, {}))), Promise.resolve().then(()=>_interopRequireWildcard(require("./0", {
        assert: {
            type: "json"
        }
    })));
