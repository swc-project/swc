function n(n) {
    var o = (function () {
        return n;
    })();
    return n++ + o;
}
console.log(n(1));
