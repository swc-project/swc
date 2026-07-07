define([
    "require",
    "foo"
], function(require, foo) {
    "use strict";
    foo.bar = 1;
    foo.bar = 2;
    return foo;
});
