//// [optionalChainingInTypeAssertions.ts]
var _foo_m, _foo_m1, _foo_m2, _foo_m3;
let foo = new class {
    m() {}
}();
null == (_foo_m = foo.m) || _foo_m.call(foo), null == (_foo_m1 = foo.m) || _foo_m1.call(foo), null == (_foo_m2 = foo.m) || _foo_m2.call(foo), null == (_foo_m3 = foo.m) || _foo_m3.call(foo), (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length;
