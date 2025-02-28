var n = 0;
(function(f, o) {
    function c() {
        if (f) n++;
    }
    o = c();
    f = 1;
    o && o.b;
    c();
})();
console.log(n);
