function a() {
    var a = "foo";
    var r = [1];
    var [v] = r;
    f(v);
}
function r() {
    var a = "foo";
    var r = { b: 1 };
    var { b: v } = r;
    f(v);
}
function v() {
    var a = "foo";
    var r = [[1]];
    var [[v]] = r;
    f(v);
}
function o() {
    var a = "foo";
    var r = { b: { b: 1 } };
    var {
        b: { b: v },
    } = r;
    f(v);
}
function n() {
    var a = "foo";
    var r = [1, 2, 3, 4, 5];
    var v = [[1, 2, 3]];
    var o = { h: 1 };
    var [f, ...n] = r;
    var [...[b, c]] = v;
    var [...{ g: i }] = o;
    c(f, n, b, c, g);
}
