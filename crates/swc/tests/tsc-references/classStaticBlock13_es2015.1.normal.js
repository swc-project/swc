import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
class C {
    foo() {
        return _class_static_private_field_spec_get(C, C, _x);
    }
}
var _x = {
    writable: true,
    value: 123
};
var __ = {
    writable: true,
    value: (()=>{
        console.log(_class_static_private_field_spec_get(C, C, _x));
    })()
};
