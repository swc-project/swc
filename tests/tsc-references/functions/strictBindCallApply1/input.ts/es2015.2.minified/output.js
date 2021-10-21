foo.bind(void 0), foo.bind(void 0, 10), foo.bind(void 0, 10, "hello"), foo.bind(void 0, 10, 20), overloaded.bind(void 0), generic.bind(void 0), foo.call(void 0, 10, "hello"), foo.call(void 0, 10), foo.call(void 0, 10, 20), foo.call(void 0, 10, "hello", 30), foo.apply(void 0, [
    10,
    "hello"
]), foo.apply(void 0, [
    10
]), foo.apply(void 0, [
    10,
    20
]), foo.apply(void 0, [
    10,
    "hello",
    30
]);
class C {
    foo(a, b) {
        return "";
    }
    overloaded(x) {
    }
    generic(x1) {
        return x1;
    }
    constructor(a1, b1){
    }
}
c.foo.bind(c), c.foo.bind(c, 10), c.foo.bind(c, 10, "hello"), c.foo.bind(c, 10, 20), c.foo.bind(void 0), c.overloaded.bind(c), c.generic.bind(c), c.foo.call(c, 10, "hello"), c.foo.call(c, 10), c.foo.call(c, 10, 20), c.foo.call(c, 10, "hello", 30), c.foo.call(void 0, 10, "hello"), c.foo.apply(c, [
    10,
    "hello"
]), c.foo.apply(c, [
    10
]), c.foo.apply(c, [
    10,
    20
]), c.foo.apply(c, [
    10,
    "hello",
    30
]), c.foo.apply(void 0, [
    10,
    "hello"
]), C.bind(void 0), C.bind(void 0, 10), C.bind(void 0, 10, "hello"), C.bind(void 0, 10, 20), C.call(c, 10, "hello"), C.call(c, 10), C.call(c, 10, 20), C.call(c, 10, "hello", 30), C.apply(c, [
    10,
    "hello"
]), C.apply(c, [
    10
]), C.apply(c, [
    10,
    20
]), C.apply(c, [
    10,
    "hello",
    30
]);
