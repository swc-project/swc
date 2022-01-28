var A = 1;
(function f0() {
    var a = 2;
    console.log(a - 5);
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
(function f3() {
    var b = typeof C !== "undefined";
    var c = 4;
    if (b) {
        return "yes";
    } else {
        return "no";
    }
})();
console.log(A + 1);
