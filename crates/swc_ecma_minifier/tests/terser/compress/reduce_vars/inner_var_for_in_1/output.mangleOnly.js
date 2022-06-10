function a() {
    var b = 1, a = 2;
    for(a in (function() {
        return x(b, a, c);
    })()){
        var c = 3, d = 4;
        x(b, a, c, d);
    }
    x(b, a, c, d);
}
