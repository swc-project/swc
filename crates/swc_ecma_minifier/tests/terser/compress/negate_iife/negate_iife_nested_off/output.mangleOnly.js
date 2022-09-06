function n(n) {
    this.f = n;
}
new n(function () {
    (function (n) {
        (function (n) {
            console.log(n);
        })(n);
    })(7);
}).f();
