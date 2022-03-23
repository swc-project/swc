"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var swcHelpers = require("@swc/helpers");
var _foo = swcHelpers.interopRequireDefault(require("foo"));
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
