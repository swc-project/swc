var n = 1, i = 0;
(function(o) {
    var t = (function() {
        this;
        n-- && c();
    })();
    function c() {
        t && i++;
    }
    c((t = 1));
})();
console.log(i);
