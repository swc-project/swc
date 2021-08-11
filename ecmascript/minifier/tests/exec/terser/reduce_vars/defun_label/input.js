!(function () {
    function f(a) {
        L: {
            if (a) break L;
            return 1;
        }
    }
    console.log(f(2));
})();
