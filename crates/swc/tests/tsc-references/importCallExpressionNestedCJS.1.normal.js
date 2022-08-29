//// [foo.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _default = "./foo";
//// [index.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _asyncToGenerator(function*() {
        return yield Promise.resolve((yield Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./foo")))).default).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
    });
    return _foo.apply(this, arguments);
}
