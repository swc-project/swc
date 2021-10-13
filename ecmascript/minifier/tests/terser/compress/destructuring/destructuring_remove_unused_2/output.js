function a() {
    var a1 = [
        ,
        ,
        1
    ];
    var [b] = a1;
    f(b);
}
function b() {
    var a1 = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: a1  }] = a1;
    f(b);
}
