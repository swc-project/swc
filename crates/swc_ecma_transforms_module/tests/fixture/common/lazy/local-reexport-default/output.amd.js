define([
    "exports",
    "./foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>_foo.default,
        enumerable: true
    });
    _foo = _interopRequireDefault(_foo);
});
