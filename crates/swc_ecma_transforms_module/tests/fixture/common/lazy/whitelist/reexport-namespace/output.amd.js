define([
    "require",
    "exports",
    "white",
    "black"
], function(require, exports, _white, _black) {
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
        namespace1: ()=>_white,
        namespace2: ()=>_black
    });
    _white = /*#__PURE__*/ _interopRequireWildcard(_white);
    _black = /*#__PURE__*/ _interopRequireWildcard(_black);
});
