function a() {
    var a = "foo";
    var b = [
        ,
        ,
        1
    ];
    var [c] = b;
    f(c);
}
function b() {
    var a = "foo";
    var c = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: c  }] = c;
    f(b);
}
