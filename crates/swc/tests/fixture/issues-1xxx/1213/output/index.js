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
    default: ()=>NotOK
});
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _foo = _interopRequireDefaultMjs(require("foo"));
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
