define([
    "require",
    "./bar/foo",
    "./baz/foo"
], function(require, _foo, _foo1) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    _foo1 = _interopRequireDefault(_foo1);
    const a = [
        _foo1.default,
        _foo.default
    ];
});
