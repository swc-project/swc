define([
    "require",
    "./foo"
], function(require, _foo) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    console.log(_foo.default);
});
