var a = "PASS";
var b = {};
(function() {
    var c = a;
    c && (function(a, b) {
        console.log(a, b);
    })(b, c);
})();
