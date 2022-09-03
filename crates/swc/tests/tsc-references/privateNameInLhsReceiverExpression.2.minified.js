//// [privateNameInLhsReceiverExpression.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _y = new WeakMap();
class Test {
    static something(obj) {
        var _s;
        _class_private_field_set(obj[(new class {
            constructor(){
                _class_private_field_init(this, new WeakMap(), {
                    writable: !0,
                    value: 1
                }), this.s = "prop";
            }
        }).s], _y, 1), _class_private_field_set(_s = obj[(new class {
            constructor(){
                _class_private_field_init(this, new WeakMap(), {
                    writable: !0,
                    value: 1
                }), this.s = "prop";
            }
        }).s], _y, _class_private_field_get(_s, _y) + 1);
    }
    constructor(){
        _class_private_field_init(this, _y, {
            writable: !0,
            value: 123
        });
    }
}
