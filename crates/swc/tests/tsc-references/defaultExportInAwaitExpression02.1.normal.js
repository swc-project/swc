//// [a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const x = new Promise((resolve, reject)=>{
    resolve({});
});
const _default = x;
//// [b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
const _a = /*#__PURE__*/ _interopRequireDefault(require("./a"));
_asyncToGenerator(function*() {
    const value = yield _a.default;
})();
