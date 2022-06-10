function a(a) {
    (function(b) {
        a = b();
    })(function() {
        return (function(a) {
            return a;
        })(function(a) {});
    });
}
