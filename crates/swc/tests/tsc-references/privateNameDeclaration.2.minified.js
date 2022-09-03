//// [privateNameDeclaration.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap(), _bar = new WeakMap();
class A {
    quux() {}
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _bar, {
            writable: !0,
            value: 6
        }), this.qux = 6;
    }
}
