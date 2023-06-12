!function() {
    window.used = (function() {
        window.foo;
        var A, c, B = window.bar, C = window.foobar;
        return A = B, -1 === (c = C) ? A : $(A, c);
    }).call(this);
}();
