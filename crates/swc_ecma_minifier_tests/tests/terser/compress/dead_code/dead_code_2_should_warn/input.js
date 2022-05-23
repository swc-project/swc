function f() {
    g();
    x = 10;
    throw new Error("foo");
    if (x) {
        y();
        var x;
        function g() {}
        (function () {
            var q;
            function y() {}
        })();
    }
}
f();
