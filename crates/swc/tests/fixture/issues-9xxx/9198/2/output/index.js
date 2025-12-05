import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function foo(_0, _1 = void 0) {
    let _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { a } = _ref1, rest = _object_without_properties(_ref1, [
        "a"
    ]), [foo1 = rest] = _rest;
    console.log(a, rest, foo1);
}
foo({
    a: 1,
    b: 2,
    c: 3
});
function bar(_0, _1) {
    const _ref = [
        _0,
        _1
    ], [_ref1, ..._rest] = _ref, { a } = _ref1, rest = _object_without_properties(_ref1, [
        "a"
    ]), [foo = rest] = _rest;
}
bar({
    a: 1,
    b: 2,
    c: 3
});
function x1(a, _1 = void 0, _2, ..._3) {
    let _ref = [
        _1,
        _2,
        _3
    ], [b = a, _ref1, ..._rest] = _ref, { c } = _ref1, d = _object_without_properties(_ref1, [
        "c"
    ]), [{ e }] = _rest;
    console.log(a, b, c, d, e);
}
x1(1, 2, {});
class Foo {
    hello() {
        const foo = (_0, _1 = void 0)=>{
            let _ref = [
                _0,
                _1
            ], [_ref1, ..._rest] = _ref, { a = this.world() } = _ref1, c = _object_without_properties(_ref1, [
                "a"
            ]), [b = a] = _rest;
            console.log(a, b, c);
        };
        foo({});
        function bar(_0, _1 = void 0) {
            let _ref = [
                _0,
                _1
            ], [_ref1, ..._rest] = _ref, { a } = _ref1, c = _object_without_properties(_ref1, [
                "a"
            ]), [b = this.world()] = _rest;
            console.log(a, b, c);
        }
        bar.call(this, {});
    }
    world() {
        return "world";
    }
}
new Foo().hello();
