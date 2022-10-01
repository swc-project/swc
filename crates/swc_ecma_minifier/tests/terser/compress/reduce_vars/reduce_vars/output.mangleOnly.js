var A = 1;
(function o() {
    var o = 2;
    console.log(o - 5);
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
    var o = typeof C !== "undefined";
    var n = 4;
    if (o) {
        return "yes";
    } else {
        return "no";
    }
})();
console.log(A + 1);
