var _privateField = /*#__PURE__*/ _class_private_field_loose_key("_privateField"), _privateFieldValue = /*#__PURE__*/ _class_private_field_loose_key("_privateFieldValue");
class Cl {
    publicGetPrivateField() {
        return _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue];
    }
    publicSetPrivateField(newValue) {
        _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] = newValue;
    }
    constructor(){
        Object.defineProperty(this, _privateFieldValue, {
            get: get_privateFieldValue,
            set: set_privateFieldValue
        });
        Object.defineProperty(this, _privateField, {
            writable: true,
            value: "top secret string"
        });
        this.publicField = "not secret string";
    }
}
function get_privateFieldValue() {
    return _class_private_field_loose_base(this, _privateField)[_privateField];
}
function set_privateFieldValue(newValue) {
    _class_private_field_loose_base(this, _privateField)[_privateField] = newValue;
}
