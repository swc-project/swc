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
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default, _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default, _a = _interopRequireDefault(require("./a"));
_asyncToGenerator(function*() {
    yield _a.default;
})();
