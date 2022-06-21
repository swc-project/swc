"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    get: ()=>NotOK,
    enumerable: true
});
var _foo = _interopRequireDefault(require("foo"));
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
