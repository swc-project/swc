//// [computedPropertyNamesWithStaticProperty.ts]
new WeakMap();
var C2, __1 = new WeakMap();
let _C1_staticProp = C1.staticProp, _C1_staticProp1 = C1.staticProp, _C1_staticProp2 = C1.staticProp, _C2_staticProp = C2.staticProp, _C2_staticProp1 = C2.staticProp, _C2_staticProp2 = C2.staticProp;
class C1 {
    get [_C1_staticProp]() {
        return "hello";
    }
    set [_C1_staticProp1](x) {}
    [_C1_staticProp2]() {}
}
C2 = class {
    get [_C2_staticProp]() {
        return "hello";
    }
    set [_C2_staticProp1](x) {}
    [_C2_staticProp2]() {}
}, __1.set(C2, {
    writable: !0,
    value: C2.staticProp = 10
});
