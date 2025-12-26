//// [privateNameStaticEmitHelpers.ts]
//// [main.ts]
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = new WeakMap(), _c = new WeakMap();
export class S {
}
function b() {
    _class_private_field_set(this, _a, 42);
}
_c.set(S, {
    get: function() {
        return b.call(S);
    },
    set: void 0
}), _a.set(S, {
    writable: !0,
    value: 1
});
//// [tslib.d.ts]
export { };
