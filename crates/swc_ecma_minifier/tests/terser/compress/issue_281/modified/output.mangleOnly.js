function a(a) {
    var b = (function() {
        return a;
    })();
    return a++ + b;
}
console.log(a(1));
