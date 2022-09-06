//// [optionalChainingInTypeAssertions.ts]
var ref, ref1, /*a1*/ /*a2*/ ref2, /*b1*/ ref3 /*b3*/ ;
class Foo {
    m() {}
}
const foo = new Foo();
(ref = foo.m) === null || ref === void 0 ? void 0 : ref.call(foo);
(ref1 = foo.m) === null || ref1 === void 0 ? void 0 : ref1.call(foo);
(ref2 = foo.m) === null || ref2 === void 0 ? void 0 : ref2.call(foo);
(ref3 = foo.m) === null || ref3 === void 0 ? void 0 : ref3.call(foo);
// https://github.com/microsoft/TypeScript/issues/50148
(foo === null || foo === void 0 ? void 0 : foo.m).length;
(foo === null || foo === void 0 ? void 0 : foo.m).length;
(foo === null || foo === void 0 ? void 0 : foo["m"]).length;
(foo === null || foo === void 0 ? void 0 : foo["m"]).length;
