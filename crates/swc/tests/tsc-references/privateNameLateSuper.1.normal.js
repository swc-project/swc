//// [privateNameLateSuper.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
class B {
}
var _x = /*#__PURE__*/ new WeakMap();
class A extends B {
    constructor(){
        void 0;
        super();
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
