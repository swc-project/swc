import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
const a1 = f1(1, 2); // 1 | 2
const a2 = f1(1, "hello"); // 1
const a3 = f1(1, sn); // number
const a4 = f1(undefined, "abc"); // undefined
const a5 = f1("foo", "bar"); // "foo"
const a6 = f1(true, false); // boolean
const a7 = f1("hello", 1); // Error
var b1 = f2([
    "string",
    true
]); // boolean
const c1 = f3(5); // 5
const c2 = f3(sn); // number
const c3 = f3(true); // true
const c4 = f3(b); // true
const c5 = f3("abc"); // never
const d1 = f4("abc");
const d2 = f4(s);
const d3 = f4(42); // Error
function qux(p1, p2) {
    p1 = p2;
}
foo(x);
const y = bar(1, 2);
// Repro from #32752
const containsPromises = Symbol();
function fun(deepPromised) {
    return _fun.apply(this, arguments);
}
function _fun() {
    _fun = _async_to_generator(function*(deepPromised) {
        const deepPromisedWithIndexer = deepPromised;
        for (const value of Object.values(deepPromisedWithIndexer)){
            const awaitedValue = yield value;
            if (awaitedValue) yield fun(awaitedValue);
        }
    });
    return _fun.apply(this, arguments);
}
baz(xx);
// @strict: true
// @target: esnext
export { };
