"use strict";
(function(o, r) {
    var a = arguments[0];
    var t = arguments[1];
    var o = "foo";
    r++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(o, r, a, t, arguments[0], arguments[1]);
})("bar", 42);
