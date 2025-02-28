function a() {
    var v = "foo";
    var a = [
        1
    ];
    var [r] = a;
    f(r);
}
function r() {
    var v = "foo";
    var a = {
        b: 1
    };
    var { b: r } = a;
    f(r);
}
function v() {
    var v = "foo";
    var a = [
        [
            1
        ]
    ];
    var [[r]] = a;
    f(r);
}
function o() {
    var v = "foo";
    var a = {
        b: {
            b: 1
        }
    };
    var { b: { b: r } } = a;
    f(r);
}
function n() {
    var i = "foo";
    var r = [
        1,
        2,
        3,
        4,
        5
    ];
    var v = [
        [
            1,
            2,
            3
        ]
    ];
    var o = {
        h: 1
    };
    var [n, ...b] = r;
    var [...[c, a]] = v;
    var [...{ g: t }] = o;
    a(n, b, c, a, g);
}
