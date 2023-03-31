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
const _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
const _a = /*#__PURE__*/ _interop_require_default(require("./a"));
_async_to_generator(function*() {
    const value = yield _a.default;
})();
