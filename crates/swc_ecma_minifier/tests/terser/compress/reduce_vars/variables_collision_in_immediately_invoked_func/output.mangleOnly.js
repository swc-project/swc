(function(n) {
    n();
})(function() {
    window.used = function() {
        var n = window.foo, r = window.bar, o = window.foobar;
        return (function(n, r) {
            if (-1 === r) return n;
            return $(n, r);
        })(r, o);
    }.call(this);
});
