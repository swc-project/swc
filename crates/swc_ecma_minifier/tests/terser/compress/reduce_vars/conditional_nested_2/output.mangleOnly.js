var a = 0;
(function(b) {
    function c() {
        b && a++;
    }
    c(!a && c(), (b = 1));
})();
console.log(a);
