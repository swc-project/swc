import * as swcHelpers from "@swc/helpers";
var _value = new WeakMap();
new class {
    get value() {
        return swcHelpers.classPrivateFieldGet(this, _value);
    }
    set value(value) {
        swcHelpers.classPrivateFieldSet(this, _value, value);
    }
    constructor(initialValue){
        swcHelpers.classPrivateFieldInit(this, _value, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(this, _value, initialValue);
    }
}(3).value = 3;
