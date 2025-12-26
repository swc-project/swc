//// [computedPropertyNames27_ES6.ts]
let _tmp = (super(), "prop");
class Base {
}
class C extends Base {
    [_tmp]() {}
}
