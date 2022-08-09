var n = 2, o = 0;
(function $(c) {
    0 < n-- && f((c = 1));
    function f() {
        c && o++;
    }
    f();
    0 < n-- && $();
})();
console.log(o);
