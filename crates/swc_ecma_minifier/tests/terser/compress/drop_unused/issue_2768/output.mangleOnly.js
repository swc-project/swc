var a = "FAIL", o = 1;
var o = (function(o) {
    var r = (o = a);
    var v = --o + (r && (a = "PASS"));
})();
console.log(a, typeof o);
