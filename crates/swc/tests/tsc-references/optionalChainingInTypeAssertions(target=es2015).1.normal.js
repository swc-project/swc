//// [optionalChainingInTypeAssertions.ts]
var _foo_m, _foo, _foo_m1, _foo1, /*a1*/ /*a2*/ _foo_m2, _foo2, /*b1*/ _foo_m3 /*b3*/ , _foo3, _foo4, _foo5, _foo6, _foo7;
class Foo {
    m() {}
}
const foo = new Foo();
(_foo_m = (_foo = foo).m) === null || _foo_m === void 0 ? void 0 : _foo_m.call(_foo);
(_foo_m1 = (_foo1 = foo).m) === null || _foo_m1 === void 0 ? void 0 : _foo_m1.call(_foo1);
(_foo_m2 = (_foo2 = foo).m) === null || _foo_m2 === void 0 ? void 0 : _foo_m2.call(_foo2);
(_foo_m3 = (_foo3 = foo).m) === null || _foo_m3 === void 0 ? void 0 : _foo_m3.call(_foo3);
// https://github.com/microsoft/TypeScript/issues/50148
((_foo4 = foo) === null || _foo4 === void 0 ? void 0 : _foo4.m).length;
((_foo5 = foo) === null || _foo5 === void 0 ? void 0 : _foo5.m).length;
((_foo6 = foo) === null || _foo6 === void 0 ? void 0 : _foo6["m"]).length;
((_foo7 = foo) === null || _foo7 === void 0 ? void 0 : _foo7["m"]).length;
