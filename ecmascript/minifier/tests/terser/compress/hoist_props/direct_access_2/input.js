var o = { a: 1 };
var f = function (k) {
    if (o[k]) return "PASS";
};
console.log(f("a"));
