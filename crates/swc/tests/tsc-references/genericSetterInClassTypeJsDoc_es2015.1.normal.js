import * as swcHelpers from "@swc/helpers";
var _value = new WeakMap();
// @target: esnext
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: genericSetterInClassTypeJsDoc.js
// @out: genericSetterInClassTypeJsDoc-out.js
/**
 * @template T
 */ class Box {
    /** @type {T} */ get value() {
        return swcHelpers.classPrivateFieldGet(this, _value);
    }
    set value(value) {
        swcHelpers.classPrivateFieldSet(this, _value, value);
    }
    /** @param {T} initialValue */ constructor(initialValue){
        swcHelpers.classPrivateFieldInit(this, _value, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _value, initialValue);
    }
}
new Box(3).value = 3;
