define([
    "foo"
], function(_foo) {
    "use strict";
    _foo.bar = 1;
    _foo.bar = 2;
    return _foo;
});
