import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _value = /*#__PURE__*/ new WeakMap();
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
        return _class_private_field_get(this, _value);
    }
    set value(value) {
        _class_private_field_set(this, _value, value);
    }
    /** @param {T} initialValue */ constructor(initialValue){
        _class_private_field_init(this, _value, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _value, initialValue);
    }
}
new Box(3).value = 3;
