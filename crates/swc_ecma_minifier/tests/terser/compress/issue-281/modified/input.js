function f5(b) {
    var a = (function () {
        return b;
    })();
    return b++ + a;
}
console.log(f5(1));
