define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    const bar = require("foo");
    (0, _foo.default)();
    bar();
});
