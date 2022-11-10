//// [optionalChainingInTypeAssertions.ts]
var _foo_m, _foo_m1, /*a1*/ /*a2*/ _foo_m2, /*b1*/ _foo_m3 /*b3*/ ;
class Foo {
    m() {}
}
const foo = new Foo();
(_foo_m = foo.m) === null || _foo_m === void 0 ? void 0 : _foo_m.call(foo);
(_foo_m1 = foo.m) === null || _foo_m1 === void 0 ? void 0 : _foo_m1.call(foo);
(_foo_m2 = foo.m) === null || _foo_m2 === void 0 ? void 0 : _foo_m2.call(foo);
(_foo_m3 = foo.m) === null || _foo_m3 === void 0 ? void 0 : _foo_m3.call(foo);
// https://github.com/microsoft/TypeScript/issues/50148
(foo === null || foo === void 0 ? void 0 : foo.m).length;
(foo === null || foo === void 0 ? void 0 : foo.m).length;
(foo === null || foo === void 0 ? void 0 : foo["m"]).length;
(foo === null || foo === void 0 ? void 0 : foo["m"]).length;
