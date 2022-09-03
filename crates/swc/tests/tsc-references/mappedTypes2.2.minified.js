//// [mappedTypes2.ts]
function verifyLibTypes() {}
function f0(s1, s2) {
    assign(s1, {
        name: "circle"
    }), assign(s2, {
        width: 10,
        height: 20
    });
}
function f1(shape) {
    freeze(shape);
}
function f2(shape) {}
function f3(shape) {
    pick(shape, "name", "location");
}
function f4() {
    mapObject({
        foo: "hello",
        bar: "world",
        baz: "bye"
    }, function(s) {
        return s.length;
    });
}
function f5(shape) {
    var p = proxify(shape);
    p.name.get(), p.width.set(42);
}
function f6(shape) {
    shape.name, shape.location.x;
}
