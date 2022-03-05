var Generic;
import * as swcHelpers from "@swc/helpers";
!function(Generic) {
    var c = new class {
        get y() {
            return 1;
        }
        set y(v) {}
    }();
    c.y = c.y;
    var _value = new WeakMap();
    new class {
        get value() {
            return swcHelpers.classPrivateFieldGet(this, _value);
        }
        set value(value) {
            swcHelpers.classPrivateFieldSet(this, _value, value);
        }
        constructor(){
            swcHelpers.classPrivateFieldInit(this, _value, {
                writable: !0,
                value: void 0
            });
        }
    }().value = 3;
}(Generic || (Generic = {}));
