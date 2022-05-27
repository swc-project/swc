var a = 0;
(function(d, b) {
    function c() {
        if (d) a++;
    }
    b = c();
    d = 1;
    b && b.b;
    c();
})();
console.log(a);
