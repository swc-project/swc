"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    default: function() {
        return NotOK;
    }
});
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js");
var _foo = (0, _interopRequireDefaultMjs.default)(require("foo"));
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
