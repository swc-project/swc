define([
    "require",
    "exports",
    "./foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "namespace", {
        enumerable: true,
        get: function() {
            return _foo;
        }
    });
    _foo = /*#__PURE__*/ _interop_require_wildcard(_foo);
});
