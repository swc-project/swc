(function (callback) {
    callback();
})(function () {
    window.used = function () {
        var A = window.foo,
            B = window.bar,
            C = window.foobar;
        return (function (A, c) {
            if (-1 === c) return A;
            return $(A, c);
        })(B, C);
    }.call(this);
});
