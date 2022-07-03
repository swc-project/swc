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
        get: ()=>bar
    });
    _foo = _interopRequireDefault(_foo);
    const bar = {
        foo: _foo.default
    };
});
