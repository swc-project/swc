"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    namespace1: ()=>_white(),
    namespace2: ()=>_black
});
function _white() {
    const data = _interopRequireWildcard(require("white"));
    _white = function() {
        return data;
    };
    return data;
}
const _black = _interopRequireWildcard(require("black"));
