var a = 0;
!(function() {
    !(function(a) {
        a = 1 + a;
        var a = 0;
        function b(b) {
            if (((a = 1 + a), 0 !== (23).toString())) (a = 1 + a), b && (b[0] = 0);
        }
        b();
    })(-1);
})();
console.log(a);
