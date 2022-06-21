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
    namespace1: ()=>_white(),
    namespace2: ()=>_black
});
function _white() {
    var data = _interopRequireWildcard(require("white"));
    _white = function() {
        return data;
    };
    return data;
}
var _black = _interopRequireWildcard(require("black"));
