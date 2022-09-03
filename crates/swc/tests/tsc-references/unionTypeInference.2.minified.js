//// [unionTypeInference.ts]
let a1 = f1(1, 2), a2 = f1(1, "hello"), a3 = f1(1, sn), a4 = f1(void 0, "abc"), a5 = f1("foo", "bar"), a6 = f1(!0, !1), a7 = f1("hello", 1);
var b1 = f2([
    "string",
    !0
]);
let c1 = f3(5), c2 = f3(sn), c3 = f3(!0), c4 = f3(b), c5 = f3("abc"), d1 = f4("abc"), d2 = f4(s), d3 = f4(42);
function qux(p1, p2) {}
foo(x);
let y = bar(1, 2), containsPromises = Symbol();
async function fun(deepPromised) {
    for (let value of Object.values(deepPromised)){
        let awaitedValue = await value;
        awaitedValue && await fun(awaitedValue);
    }
}
baz(xx);
export { };
