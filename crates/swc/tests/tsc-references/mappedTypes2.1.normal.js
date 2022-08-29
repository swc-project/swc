//// [mappedTypes2.ts]
function verifyLibTypes() {
    var x1;
    var x1;
    var x2;
    var x2;
    var x3;
    var x3;
    var x4;
    var x4;
}
function f0(s1, s2) {
    assign(s1, {
        name: "circle"
    });
    assign(s2, {
        width: 10,
        height: 20
    });
}
function f1(shape) {
    var frozen;
    var frozen;
    var frozen = freeze(shape);
}
function f2(shape) {
    var partial;
    var partial;
    var partial = {};
}
function f3(shape) {
    var x = pick(shape, "name", "location"); // { name: string, location: Point }
}
function f4() {
    var rec = {
        foo: "hello",
        bar: "world",
        baz: "bye"
    };
    var lengths = mapObject(rec, function(s) {
        return s.length;
    }); // { foo: number, bar: number, baz: number }
}
function f5(shape) {
    var p = proxify(shape);
    var name = p.name.get();
    p.width.set(42);
}
function f6(shape) {
    var name = shape.name; // string
    var location = shape.location; // DeepReadonly<Point>
    var x = location.x; // number
}
