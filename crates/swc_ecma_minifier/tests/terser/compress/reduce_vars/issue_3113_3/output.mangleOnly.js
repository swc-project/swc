var a = 0;
(function() {
    function d() {
        while(c());
    }
    var b;
    function c() {
        b && b[a++];
    }
    c((b = 1));
})();
console.log(a);
