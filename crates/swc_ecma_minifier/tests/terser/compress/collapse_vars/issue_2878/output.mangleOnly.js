var n = 0;
(function(f, i) {
    function o() {
        if (f) n++;
    }
    i = o();
    f = 1;
    i && i.b;
    o();
})();
console.log(n);
