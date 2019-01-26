function a(b, c) {
    var d = function() {
        return e();
    };
    var e = function() {
        return d();
    };
    return b + c;
}
