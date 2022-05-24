// @strictNullChecks: true
// @declaration: true
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
    const x = pick(shape, "name", "location"); // { name: string, location: Point }
}
function f4() {
    const rec = {
        foo: "hello",
        bar: "world",
        baz: "bye"
    };
    const lengths = mapObject(rec, (s)=>s.length); // { foo: number, bar: number, baz: number }
}
function f5(shape) {
    const p = proxify(shape);
    let name = p.name.get();
    p.width.set(42);
}
function f6(shape) {
    let name = shape.name; // string
    let location = shape.location; // DeepReadonly<Point>
    let x = location.x; // number
}
