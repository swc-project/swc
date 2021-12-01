function a() {
    var a1 = [
        ,
        ,
        1
    ];
    var [b1] = a1;
    f(b1);
}
function b() {
    var a2 = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: a2  }] = a2;
    f(b);
}
