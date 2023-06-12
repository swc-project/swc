//// [optionalChainingInTypeAssertions.ts]
var _foo_m, _object, _foo_m1, _object1, /*a1*/ /*a2*/ _foo_m2, _object2, /*b1*/ _foo_m3 /*b3*/ , _object3, _foo, _foo1, _foo2, _foo3;
class Foo {
    m() {}
}
const foo = new Foo();
(_object = foo) === null || _object === void 0 ? void 0 : (_foo_m = _object.m) === null || _foo_m === void 0 ? void 0 : _foo_m.call(_object);
(_object1 = foo) === null || _object1 === void 0 ? void 0 : (_foo_m1 = _object1.m) === null || _foo_m1 === void 0 ? void 0 : _foo_m1.call(_object1);
(_object2 = foo) === null || _object2 === void 0 ? void 0 : (_foo_m2 = _object2.m) === null || _foo_m2 === void 0 ? void 0 : _foo_m2.call(_object2);
(_object3 = foo) === null || _object3 === void 0 ? void 0 : (_foo_m3 = _object3.m) === null || _foo_m3 === void 0 ? void 0 : _foo_m3.call(_object3);
// https://github.com/microsoft/TypeScript/issues/50148
((_foo = foo) === null || _foo === void 0 ? void 0 : _foo.m).length;
((_foo1 = foo) === null || _foo1 === void 0 ? void 0 : _foo1.m).length;
((_foo2 = foo) === null || _foo2 === void 0 ? void 0 : _foo2["m"]).length;
((_foo3 = foo) === null || _foo3 === void 0 ? void 0 : _foo3["m"]).length;
