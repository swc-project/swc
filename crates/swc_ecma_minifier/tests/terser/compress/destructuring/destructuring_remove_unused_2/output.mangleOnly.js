function a() {
    var a = "foo";
    var r = [
        ,
        ,
        1
    ];
    var [v] = r;
    f(v);
}
function r() {
    var a = "foo";
    var v = [
        {
            a: [
                1
            ]
        }
    ];
    var [{ b: v  }] = v;
    f(r);
}
