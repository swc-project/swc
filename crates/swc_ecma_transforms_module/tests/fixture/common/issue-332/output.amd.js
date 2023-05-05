define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "bar", {
        enumerable: true,
        get: function() {
            return bar;
        }
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    const bar = {
        foo: _foo.default
    };
});
