//// [computedPropertyNames27_ES6.ts]
class Base {
}
let tmp = (super(), "prop");
class C extends Base {
    [tmp]() {}
}
