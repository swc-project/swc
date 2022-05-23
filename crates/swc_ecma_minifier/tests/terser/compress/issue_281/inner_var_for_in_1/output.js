function f() {
    var b = 2;
    for(b in x(1, b, c)){
        var c = 3, d = 4;
        x(1, b, c, d);
    }
    x(1, b, c, d);
}
