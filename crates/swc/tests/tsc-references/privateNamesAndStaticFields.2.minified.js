//// [privateNamesAndStaticFields.ts]
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
class A {
    constructor(){
        _class_static_private_field_spec_set(A, A, _foo, 3), _class_static_private_field_spec_get(B, A, _foo), _class_static_private_field_spec_get(B, A, _bar);
    }
}
var _foo = {
    writable: !0,
    value: void 0
}, _bar = {
    writable: !0,
    value: void 0
};
class B extends A {
    constructor(){
        super(), _class_static_private_field_spec_set(B, B, _foo1, "some string");
    }
}
var _foo1 = {
    writable: !0,
    value: void 0
};
let willErrorSomeDay = class {
};
