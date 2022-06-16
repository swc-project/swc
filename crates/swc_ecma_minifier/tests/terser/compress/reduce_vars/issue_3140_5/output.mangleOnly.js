var a = 1, b = 0;
(function(c) {
    var d = (function() {
        this;
        a-- && e();
    })();
    function e() {
        d && b++;
    }
    e((d = 1));
})();
console.log(b);
