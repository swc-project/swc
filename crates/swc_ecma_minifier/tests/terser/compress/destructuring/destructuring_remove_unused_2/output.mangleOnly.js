function a() {
    var c = "foo";
    var a = [
        ,
        ,
        1
    ];
    var [b] = a;
    f(b);
}
function b() {
    var c = "foo";
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
