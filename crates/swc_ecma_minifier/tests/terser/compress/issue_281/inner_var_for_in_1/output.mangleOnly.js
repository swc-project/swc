function a() {
    var a = 1, b = 2;
    for(b in (function() {
        return x(a, b, c);
    })()){
        var c = 3, d = 4;
        x(a, b, c, d);
    }
    x(a, b, c, d);
}
