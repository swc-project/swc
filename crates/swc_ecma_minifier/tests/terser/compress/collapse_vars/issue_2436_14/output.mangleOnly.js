var n = "PASS";
var a = {};
(function() {
    var o = n;
    o && (function(n, a) {
        console.log(n, a);
    })(a, o);
})();
