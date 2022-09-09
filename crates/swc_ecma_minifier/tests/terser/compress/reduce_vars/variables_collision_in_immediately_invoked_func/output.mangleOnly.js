(function (n) {
    n();
})(function () {
    window.used = function () {
        var n = window.foo,
            o = window.bar,
            i = window.foobar;
        return (function (n, o) {
            if (-1 === o) return n;
            return $(n, o);
        })(o, i);
    }.call(this);
});
