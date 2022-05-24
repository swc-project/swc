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
var swcHelpers = require("@swc/helpers");
var _foo = swcHelpers.interopRequireDefault(require("foo"));
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
var _default = NotOK;
exports.default = _default;
