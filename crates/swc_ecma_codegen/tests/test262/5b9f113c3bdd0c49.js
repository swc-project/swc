function a() {
    b();
    c = 1;
    throw "d";
    // completely discarding the `if` would introduce some
    // bugs.  UglifyJS v1 doesn't deal with this issue; in v2
    // we copy any declarations to the upper scope.
    if (c) {
        e();
        var c;
        function b() {
        }
        ;
        // but nested declarations should not be kept.
        (function() {
            var f;
            function e() {
            }
            ;
        })();
    }
}
