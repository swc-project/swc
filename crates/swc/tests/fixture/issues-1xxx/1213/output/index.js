"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _foo = _interop_require_default(require("foo"));
class NotOK {
    constructor(){
        console.log(_foo.default);
    }
}
exports.default = NotOK;
class OK {
    constructor(){
        console.log(_foo.default);
    }
}
