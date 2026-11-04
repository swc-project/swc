var _privateField = /*#__PURE__*/ _class_private_field_loose_key("_privateField"), _privateFieldValue = /*#__PURE__*/ _class_private_field_loose_key("_privateFieldValue");
class Cl {
    publicGetPrivateField() {
        return _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue];
    }
    publicSetPrivateField(newValue) {
        _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] = newValue;
    }
    get publicFieldValue() {
        return this.publicField;
    }
    set publicFieldValue(newValue) {
        this.publicField = newValue;
    }
    testUpdates() {
        _class_private_field_loose_base(this, _privateField)[_privateField] = 0;
        this.publicField = 0;
        _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] = _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue]++;
        this.publicFieldValue = this.publicFieldValue++;
        ++_class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue];
        ++this.publicFieldValue;
        _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] += 1;
        this.publicFieldValue += 1;
        _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] = -(_class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] ** _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue]);
        this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
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
