"use strict";
function n() {
    f();
    n = 10;
    throw new Error("foo");
    if (n) {
        y();
        var n;
        function f() {}
        (function() {
            var n;
            function f() {}
        })();
    }
}
n();
