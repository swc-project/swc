var a = { a: 1 };
var n = function (n) {
    if (a[n]) return "PASS";
};
console.log(n("a"));
