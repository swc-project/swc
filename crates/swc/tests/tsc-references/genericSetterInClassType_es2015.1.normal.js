import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
// @target: esnext
var Generic;
(function(Generic) {
    class C {
        get y() {
            return 1;
        }
        set y(v) {}
    }
    var c = new C();
    c.y = c.y;
    var _value = /*#__PURE__*/ new WeakMap();
    class Box {
        get value() {
            return _class_private_field_get(this, _value);
        }
        set value(value) {
            _class_private_field_set(this, _value, value);
        }
        constructor(){
            _class_private_field_init(this, _value, {
                writable: true,
                value: void 0
            });
        }
    }
    new Box().value = 3;
})(Generic || (Generic = {}));
