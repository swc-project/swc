function Foo(f) {
    this.f = f;
}
new Foo(function () {
    !(function (x) {
        !(function (y) {
            console.log(y);
        })(x);
    })(7);
}).f();
