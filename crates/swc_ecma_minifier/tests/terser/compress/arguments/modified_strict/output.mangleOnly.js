"use strict";
(function(a, r) {
    var v = arguments[0];
    var $ = arguments[1];
    var a = "foo";
    r++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(a, r, v, $, arguments[0], arguments[1]);
})("bar", 42);
