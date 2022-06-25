define([
    "require",
    "foo"
], function(require, _foo) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    function use() {
        console.log(_foo.default);
    }
});
