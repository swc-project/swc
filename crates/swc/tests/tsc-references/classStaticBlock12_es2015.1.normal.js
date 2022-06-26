import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
// @useDefineForClassFields: false
// @target: es2015
class C {
}
var _x = {
    writable: true,
    value: 1
};
var __ = {
    writable: true,
    value: (()=>{
        _class_static_private_field_spec_get(C, C, _x);
    })()
};
