//// [a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
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
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _a = /*#__PURE__*/ _interop_require_default._(require("./a"));
_async_to_generator._(function*() {
    const value = yield _a.default;
})();
