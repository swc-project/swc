"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    get: ()=>NotOK,
    enumerable: true
});
const _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
const _foo = _interopRequireDefaultMjs(require("foo"));
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
