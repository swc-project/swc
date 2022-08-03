function n(n) {
    var r = (function() {
        return n;
    })();
    return n++ + r;
}
console.log(n(1));
