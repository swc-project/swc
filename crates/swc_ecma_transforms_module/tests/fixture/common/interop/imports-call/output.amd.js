define([
    "require",
    "exports",
    "foo",
    "bar"
], function(require, exports, _foo, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interopRequireDefault(_foo);
    (0, _foo.default)("foo");
    (0, _foo.default)`foo`;
    (0, _bar.bar)("bar");
    (0, _bar.bar)`bar`;
});
