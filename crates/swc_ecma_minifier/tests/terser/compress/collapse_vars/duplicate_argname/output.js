function f() {
    return "PASS";
}
console.log(
    (function (a, a) {
        f++;
        return a;
    })("FAIL", f())
);
