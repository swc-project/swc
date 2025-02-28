(function(n) {
    n();
})(function() {
    window.used = function() {
        var i = window.foo, n = window.bar, o = window.foobar;
        return (function(n, o) {
            if (-1 === o) return n;
            return $(n, o);
        })(n, o);
    }.call(this);
});
