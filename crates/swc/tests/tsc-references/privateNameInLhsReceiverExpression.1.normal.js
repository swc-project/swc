//// [privateNameInLhsReceiverExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _y = /*#__PURE__*/ new WeakMap();
class Test {
    static something(obj) {
        var _obj__s;
        var _x, _x1;
        _class_private_field_set(obj[(new (_x = /*#__PURE__*/ new WeakMap(), class {
            constructor(){
                _class_private_field_init(this, _x, {
                    writable: true,
                    value: void 0
                });
                _class_private_field_set(this, _x, 1);
                this.s = "prop";
            }
        })).s], _y, 1);
        _class_private_field_set(_obj__s = obj[(new (_x1 = /*#__PURE__*/ new WeakMap(), class {
            constructor(){
                _class_private_field_init(this, _x1, {
                    writable: true,
                    value: void 0
                });
                _class_private_field_set(this, _x1, 1);
                this.s = "prop";
            }
        })).s], _y, _class_private_field_get(_obj__s, _y) + 1);
    }
    constructor(){
        _class_private_field_init(this, _y, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _y, 123);
    }
}
