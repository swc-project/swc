var a = "FAIL",
    c = 1;
var c = (function (b) {
    var d = (b = a);
    var e = --b + (d && (a = "PASS"));
})();
console.log(a, typeof c);
