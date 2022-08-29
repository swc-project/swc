var A = 1;
(function o() {
    var n = 2;
    console.log(n - 5);
    console.log(A - 5);
})();
(function f1() {
    var a = 2;
    console.log(a - 5);
    eval("console.log(a);");
})();
(function f2(eval) {
    var a = 2;
    console.log(a - 5);
    eval("console.log(a);");
})(eval);
(function o() {
    var n = typeof C !== "undefined";
    var e = 4;
    if (n) {
        return "yes";
    } else {
        return "no";
    }
})();
console.log(A + 1);
