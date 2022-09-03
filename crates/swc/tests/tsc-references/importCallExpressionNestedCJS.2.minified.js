//// [foo.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>_default
});
const _default = "./foo";
//// [index.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    return (_foo = _asyncToGenerator(function*() {
        return yield Promise.resolve((yield Promise.resolve().then(()=>_interopRequireWildcard(require("./foo")))).default).then((p)=>_interopRequireWildcard(require(p)));
    })).apply(this, arguments);
}
