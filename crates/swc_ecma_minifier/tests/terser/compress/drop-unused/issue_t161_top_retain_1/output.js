function f() {
    return 2;
}
console.log(
    f(),
    (function () {
        return 3;
    })()
);
