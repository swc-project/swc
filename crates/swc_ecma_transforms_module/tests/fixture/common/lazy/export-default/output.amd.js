define([
    "require",
    "exports",
    "external"
], function(require, exports, _external) {
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
        default: ()=>_external.default,
        foo: ()=>_external.default
    });
    _external = /*#__PURE__*/ _interopRequireDefault(_external);
});
