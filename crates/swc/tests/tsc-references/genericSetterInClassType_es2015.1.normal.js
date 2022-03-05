import * as swcHelpers from "@swc/helpers";
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
    var _value = new WeakMap();
    class Box {
        get value() {
            return swcHelpers.classPrivateFieldGet(this, _value);
        }
        set value(value) {
            swcHelpers.classPrivateFieldSet(this, _value, value);
        }
        constructor(){
            swcHelpers.classPrivateFieldInit(this, _value, {
                writable: true,
                value: void 0
            });
        }
    }
    new Box().value = 3;
})(Generic || (Generic = {}));
