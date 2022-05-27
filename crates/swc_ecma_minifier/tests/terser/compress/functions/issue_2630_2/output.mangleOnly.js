var a = 0;
!(function() {
    while(b()){}
    function b() {
        var b = (function() {
            a = 1 + a;
        })((a = a + 1));
    }
})();
console.log(a);
