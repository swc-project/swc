define([
    "exports",
    "foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "bar", {
        get: ()=>bar,
        enumerable: true
    });
    _foo = _interopRequireDefault(_foo);
    const bar = {
        foo
    };
});
