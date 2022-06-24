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
            get: all[name],
            enumerable: true
        });
    }
    _export(exports, {
        namespace1: ()=>_white,
        namespace2: ()=>_black
    });
    _white = _interopRequireWildcard(_white);
    _black = _interopRequireWildcard(_black);
});
