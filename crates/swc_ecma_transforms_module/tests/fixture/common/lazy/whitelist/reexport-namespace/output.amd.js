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
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get namespace1 () {
            return _white;
        },
        get namespace2 () {
            return _black;
        }
    });
    _white = /*#__PURE__*/ _interop_require_wildcard(_white);
    _black = /*#__PURE__*/ _interop_require_wildcard(_black);
});
