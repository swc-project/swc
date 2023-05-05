"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    namespace1: function() {
        return _white();
    },
    namespace2: function() {
        return _black;
    }
});
function _white() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("white"));
    _white = function() {
        return data;
    };
    return data;
}
const _black = /*#__PURE__*/ _interop_require_wildcard(require("black"));
