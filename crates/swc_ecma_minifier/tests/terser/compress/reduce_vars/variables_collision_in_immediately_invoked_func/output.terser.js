!(function () {
    window.used = function () {
        return (
            window.foo,
            (function (A, c) {
                return -1 === c ? A : $(A, c);
            })(window.bar, window.foobar)
        );
    }.call(this);
})();
