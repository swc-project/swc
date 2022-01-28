function a() {
    var unused = "foo";
    var a = [, , 1];
    var [b] = a;
    f(b);
}
function b() {
    var unused = "foo";
    var a = [{ a: [1] }];
    var [{ b: a }] = a;
    f(b);
}
