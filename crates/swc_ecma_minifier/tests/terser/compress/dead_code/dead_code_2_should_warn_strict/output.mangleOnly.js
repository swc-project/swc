"use strict";
function n() {
    g();
    n = 10;
    throw new Error("foo");
    if (n) {
        y();
        var n;
        function o() {}
        (function() {
            var n;
            function o() {}
        })();
    }
}
n();
