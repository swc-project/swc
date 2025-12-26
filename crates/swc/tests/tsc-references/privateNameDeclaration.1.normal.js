//// [privateNameDeclaration.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
class A {
    quux() {}
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _bar, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _bar, 6);
        this.qux = 6;
    }
}
