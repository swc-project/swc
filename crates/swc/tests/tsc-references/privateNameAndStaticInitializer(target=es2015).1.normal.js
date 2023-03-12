//// [privateNameAndStaticInitializer.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _foo = /*#__PURE__*/ new WeakMap(), _prop = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _prop, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, 1);
        _class_private_field_set(this, _prop, 2);
    }
}
(()=>{
    A.inst = new A();
})();
