function a(a) {
    this.f = a;
}
new a(function() {
    (function(a) {
        (function(a) {
            console.log(a);
        })(a);
    })(7);
}).f();
