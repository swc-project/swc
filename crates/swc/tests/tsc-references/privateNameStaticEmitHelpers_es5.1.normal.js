import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export var S = function S() {
    "use strict";
    _class_call_check(this, S);
};
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
