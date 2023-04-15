define([
    "require",
    "exports",
    "./Z"
], function(require, exports, _Z) {
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
        X: ()=>_Z.default,
        X2: ()=>_Z.X2,
        Y: ()=>_Z.Y
    });
    _Z = /*#__PURE__*/ _interop_require_wildcard(_export_star(_Z, exports));
});
