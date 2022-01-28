function a() {
    var unused = "foo";
    var a = [1];
    var [b] = a;
    f(b);
}
function b() {
    var unused = "foo";
    var a = { b: 1 };
    var { b: b } = a;
    f(b);
}
function c() {
    var unused = "foo";
    var a = [[1]];
    var [[b]] = a;
    f(b);
}
function d() {
    var unused = "foo";
    var a = { b: { b: 1 } };
    var {
        b: { b: b },
    } = a;
    f(b);
}
function e() {
    var unused = "foo";
    var a = [1, 2, 3, 4, 5];
    var x = [[1, 2, 3]];
    var y = { h: 1 };
    var [b, ...c] = a;
    var [...[e, f]] = x;
    var [...{ g: h }] = y;
    f(b, c, e, f, g);
}
