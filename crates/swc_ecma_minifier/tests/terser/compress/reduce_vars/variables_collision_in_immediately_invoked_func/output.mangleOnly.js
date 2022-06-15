(function(a) {
    a();
})(function() {
    window.used = function() {
        var a = window.foo, b = window.bar, c = window.foobar;
        return (function(a, b) {
            if (-1 === b) return a;
            return $(a, b);
        })(b, c);
    }.call(this);
});
