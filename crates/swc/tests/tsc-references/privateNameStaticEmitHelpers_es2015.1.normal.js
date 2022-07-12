// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
export class S {
}
var _c = {
    get: get_c,
    set: void 0
};
var _a = {
    writable: true,
    value: 1
};
function b() {
    _class_static_private_field_spec_set(this, S, _a, 42);
}
function get_c() {
    return _class_static_private_method_get(S, S, b).call(S);
}
