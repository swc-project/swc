import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
// @target: es2015
class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 1
        });
    }
}
var _foo = {
    writable: true,
    value: true
}// error (duplicate)
;
class B {
    test(x) {
        swcHelpers.classStaticPrivateFieldSpecGet(x, B, _foo1); // error (#foo is a static property on B, not an instance property)
    }
}
var _foo1 = {
    writable: true,
    value: true
};
