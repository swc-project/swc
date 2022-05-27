(function(a) {
    a();
})(function() {
    window.used = function() {
        var c = window.foo, a = window.bar, b = window.foobar;
        return (function(a, b) {
            if (-1 === b) return a;
            return $(a, b);
        })(a, b);
    }.call(this);
});
