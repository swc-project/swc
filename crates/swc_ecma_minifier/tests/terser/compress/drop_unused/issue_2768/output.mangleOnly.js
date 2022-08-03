var a = "FAIL", r = 1;
var r = (function(r) {
    var v = (r = a);
    var o = --r + (v && (a = "PASS"));
})();
console.log(a, typeof r);
