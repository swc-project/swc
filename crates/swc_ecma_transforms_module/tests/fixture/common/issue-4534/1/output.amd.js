define([
    "require",
    "exports",
    "./A"
], function(require, exports, _A) {
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
        A: function() {
            return _A;
        },
        B: function() {
            return _A;
        }
    });
    _A = /*#__PURE__*/ _interop_require_wildcard(_A);
});
