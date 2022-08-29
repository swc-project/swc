//// [importAssertion1.ts]
"use strict";
//// [0.ts]
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
    a: ()=>a,
    b: ()=>b
});
const a = 1;
const b = 2;
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _0 = /*#__PURE__*/ _interopRequireWildcard(require("./0"));
_0.a;
_0.b;
_0.a;
_0.b;
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _0 = require("./0");
_0.a;
_0.b;
_0.a;
_0.b;
//// [3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const a = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
const b = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", {
        assert: {
            type: "json"
        }
    })));
const c = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", {
        assert: {
            type: "json",
            ttype: "typo"
        }
    })));
const d = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", {
        assert: {}
    })));
const dd = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", {})));
const e = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", foo())));
const f = Promise.resolve().then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
const g = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", {}, {})));
const h = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0", {
        assert: {
            type: "json"
        }
    })));
