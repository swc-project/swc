var a = 0;
(function(b, c) {
    function d() {
        if (b) a++;
    }
    c = d();
    b = 1;
    c && c.b;
    d();
})();
console.log(a);
