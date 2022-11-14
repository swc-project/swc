//// [computedPropertyNames27_ES6.ts]
class Base {
}
let _tmp = (super(), "prop");
class C extends Base {
    [_tmp]() {}
}
