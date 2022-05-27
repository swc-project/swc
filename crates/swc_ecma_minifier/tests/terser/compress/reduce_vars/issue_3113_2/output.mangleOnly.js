var a = 0;
(function() {
    function b() {
        while(d());
    }
    var c = b();
    function d() {
        c && c[a++];
    }
    c = 1;
    d();
})();
console.log(a);
