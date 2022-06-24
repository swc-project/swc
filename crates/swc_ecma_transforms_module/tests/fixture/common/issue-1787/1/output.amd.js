define([
    "exports",
    "./bar/foo",
    "./baz/foo"
], function(exports, _foo, _foo1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = _interopRequireDefault(_foo);
    _foo1 = _interopRequireDefault(_foo1);
    const a = [
        _foo1.default,
        _foo.default
    ];
});
