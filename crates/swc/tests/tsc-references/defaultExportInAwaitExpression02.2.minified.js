//// [a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>_default
});
const x = new Promise((resolve, reject)=>{
    resolve({});
}), _default = x;
//// [b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default, _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default, _a = _interop_require_default(require("./a"));
_async_to_generator(function*() {
    yield _a.default;
})();
