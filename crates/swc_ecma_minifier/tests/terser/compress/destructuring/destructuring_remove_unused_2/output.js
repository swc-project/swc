function a() {
    var a = [
        ,
        ,
        1
    ];
    var [b] = a;
    f(b);
}
function b() {
    var a = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: a  }] = a;
    f(b);
}
