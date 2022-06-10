var b = 1, a = 0;
(function(e) {
    var c = (function() {
        this;
        b-- && d();
    })();
    function d() {
        c && a++;
    }
    d((c = 1));
})();
console.log(a);
