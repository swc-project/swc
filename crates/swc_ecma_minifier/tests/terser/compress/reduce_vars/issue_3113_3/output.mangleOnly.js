var a = 0;
(function() {
    function b() {
        while(d());
    }
    var c;
    function d() {
        c && c[a++];
    }
    d((c = 1));
})();
console.log(a);
