//// [privateNameStaticEmitHelpers.ts]
//// [main.ts]
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = new WeakMap(), _c = new WeakMap();
export class S {
}
function b() {
    _class_private_field_set(this, _a, 42);
}
function get_c() {
    return b.call(S);
}
_c.set(S, {
    get: get_c,
    set: void 0
});
_a.set(S, {
    writable: true,
    value: 1
});
//// [tslib.d.ts]
// these are pre-TS4.3 versions of emit helpers, which only supported private instance fields
export { };
