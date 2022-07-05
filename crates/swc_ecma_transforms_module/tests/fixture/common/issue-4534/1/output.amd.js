define([
    "require",
    "exports",
    "./A"
], function(require, exports, _a) {
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
        A: ()=>_a,
        B: ()=>_a
    });
    _a = /*#__PURE__*/ _interopRequireWildcard(_a);
});
