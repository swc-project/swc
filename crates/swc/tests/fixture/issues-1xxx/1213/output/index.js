"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>NotOK
});
const _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
const _foo = /*#__PURE__*/ _interop_require_default(require("foo"));
class OK {
    constructor(){
        console.log(_foo.default);
    }
}
class NotOK {
    constructor(){
        console.log(_foo.default);
    }
}
