function a() {
    var a = "foo";
    var o = [
        ,
        ,
        1
    ];
    var [r] = o;
    f(r);
}
function o() {
    var a = "foo";
    var r = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: r  }] = r;
    f(o);
}
