define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Foo", {
        get: ()=>_foo.Foo,
        enumerable: true
    });
    _foo = _interopRequireWildcard(_foo);
});
