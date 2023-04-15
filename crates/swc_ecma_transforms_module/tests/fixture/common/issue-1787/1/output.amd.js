define([
    "require",
    "exports",
    "./bar/foo",
    "./baz/foo"
], function(require, exports, _foo, _foo1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    _foo1 = /*#__PURE__*/ _interop_require_default(_foo1);
    const a = [
        _foo1.default,
        _foo.default
    ];
});
