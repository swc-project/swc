var n = 2, o = 1;
(function() {
    function c(o) {
        f();
        --n >= 0 && c({});
    }
    c(o++);
    function f() {
        o++;
    }
})();
console.log(o);
