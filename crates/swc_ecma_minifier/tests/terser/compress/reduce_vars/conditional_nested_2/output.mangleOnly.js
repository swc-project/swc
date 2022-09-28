var n = 0;
(function(o) {
    function c() {
        o && n++;
    }
    c(!n && c(), (o = 1));
})();
console.log(n);
