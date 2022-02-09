"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _foo = _interopRequireDefault(require("foo"));
class NotOK {
    constructor(){
        console.log(_foo.default);
    }
}
exports.default = NotOK;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class OK {
    constructor(){
        console.log(_foo.default);
    }
}
