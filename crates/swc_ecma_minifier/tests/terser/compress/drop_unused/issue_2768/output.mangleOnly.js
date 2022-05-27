var b = "FAIL", a = 1;
var a = (function(a) {
    var c = (a = b);
    var d = --a + (c && (b = "PASS"));
})();
console.log(b, typeof a);
