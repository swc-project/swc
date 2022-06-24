define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = _interopRequireDefault(_foo);
    function use() {
        console.log(_foo.default);
    }
});
