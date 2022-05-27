"use strict";
function a() {
    b();
    a = 10;
    throw new Error("foo");
    if (a) {
        y();
        var a;
        function b() {}
        (function() {
            var a;
            function b() {}
        })();
    }
}
a();
