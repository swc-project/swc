//// [privateNameStaticEmitHelpers.ts]
//// [main.ts]
import { _ as _class_static_private_field_spec_set } from "@swc/helpers/_/_class_static_private_field_spec_set";
import { _ as _class_static_private_method_get } from "@swc/helpers/_/_class_static_private_method_get";
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
//// [tslib.d.ts]
// these are pre-TS4.3 versions of emit helpers, which only supported private instance fields
export { };
