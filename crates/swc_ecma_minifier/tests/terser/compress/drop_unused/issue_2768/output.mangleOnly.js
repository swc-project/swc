var a = "FAIL", b = 1;
var b = (function(b) {
    var c = (b = a);
    var d = --b + (c && (a = "PASS"));
})();
console.log(a, typeof b);
