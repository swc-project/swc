var a = 0;
(function() {
    while(b());
    function b() {
        var b = ((a = 1 + a), void (a = 1 + a));
        b && b[0];
    }
})();
console.log(a);
