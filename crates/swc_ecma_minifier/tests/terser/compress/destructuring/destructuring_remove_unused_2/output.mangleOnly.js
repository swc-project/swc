function a() {
    var r = "foo";
    var a = [
        ,
        ,
        1
    ];
    var [o] = a;
    f(o);
}
function o() {
    var r = "foo";
    var a = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: a }] = a;
    f(o);
}
