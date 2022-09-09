var o = "FAIL",
    a = 1;
var a = (function (a) {
    var r = (a = o);
    var v = --a + (r && (o = "PASS"));
})();
console.log(o, typeof a);
