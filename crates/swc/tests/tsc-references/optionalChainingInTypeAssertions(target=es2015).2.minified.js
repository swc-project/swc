//// [optionalChainingInTypeAssertions.ts]
var _foo_m, _foo_m1, /*a1*/ /*a2*/ _foo_m2, /*b1*/ _foo_m3 /*b3*/ ;
const foo = new class {
    m() {}
}();
null === (_foo_m = foo.m) || void 0 === _foo_m || _foo_m.call(foo), null === (_foo_m1 = foo.m) || void 0 === _foo_m1 || _foo_m1.call(foo), null === (_foo_m2 = foo.m) || void 0 === _foo_m2 || _foo_m2.call(foo), null === (_foo_m3 = foo.m) || void 0 === _foo_m3 || _foo_m3.call(foo), // https://github.com/microsoft/TypeScript/issues/50148
(null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length;
