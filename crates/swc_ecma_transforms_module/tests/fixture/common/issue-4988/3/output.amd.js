define([
    "require",
    "foo"
], function(require, _foo) {
    "use strict";
    _foo.bar = 1;
    module.exports = _foo;
    _foo.bar = 2;
});
