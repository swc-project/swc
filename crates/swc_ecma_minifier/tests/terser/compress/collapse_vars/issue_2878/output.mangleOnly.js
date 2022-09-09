var n = 0;
(function (o, c) {
    function f() {
        if (o) n++;
    }
    c = f();
    o = 1;
    c && c.b;
    f();
})();
console.log(n);
