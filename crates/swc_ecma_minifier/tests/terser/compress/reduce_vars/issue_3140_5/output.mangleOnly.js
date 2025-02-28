var o = 1, n = 0;
(function(t) {
    var c = (function() {
        this;
        o-- && i();
    })();
    function i() {
        c && n++;
    }
    i((c = 1));
})();
console.log(n);
