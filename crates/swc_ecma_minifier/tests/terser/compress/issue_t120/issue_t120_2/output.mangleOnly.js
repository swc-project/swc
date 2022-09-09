function a(a) {
    var r = function (a) {
        var r = a.data;
        return r && r.a != r.b;
    };
    while (r(a)) {
        a = a.data;
    }
    return a;
}
var r = { a: 1, b: 2, data: { a: "hello" } };
console.log(a(r).a, a({ a: "world" }).a);
