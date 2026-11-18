var _privateField = /*#__PURE__*/ new WeakMap(), _privateFieldValue = /*#__PURE__*/ new WeakMap();
class Cl {
    constructor(){
        _class_private_field_init(this, _privateFieldValue, {
            get: void 0,
            set: set_privateFieldValue
        });
        _class_private_field_init(this, _privateField, {
            writable: true,
            value: 0
        });
        this.publicField = (this, _write_only_error("#privateFieldValue"));
    }
}
function set_privateFieldValue(newValue) {
    _class_private_field_set(this, _privateField, newValue);
}
