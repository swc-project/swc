define([
    "require",
    "foo"
], function(require, _foo) {
    "use strict";
    _foo.bar = 1;
    _foo.bar = 2;
    return _foo;
});
