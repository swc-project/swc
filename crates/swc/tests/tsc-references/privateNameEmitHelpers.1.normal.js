//// [privateNameEmitHelpers.ts]
//// [main.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export class C {
    constructor(){
        _b.add(this);
        _c.set(this, {
            get: void 0,
            set: set_c
        });
        _class_private_field_init(this, _a, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _a, 1);
    }
}
function b() {
    var _this;
    _this = this, _c.get(_this).set.call(_this, 42);
}
function set_c(v) {
    var _this;
    _this = this, _class_private_field_set(_this, _a, _class_private_field_get(_this, _a) + v);
}
//// [tslib.d.ts]
// these are pre-TS4.3 versions of emit helpers, which only supported private instance fields
export { };
