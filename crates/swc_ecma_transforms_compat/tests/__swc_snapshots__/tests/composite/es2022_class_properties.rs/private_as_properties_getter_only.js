var _privateField = /*#__PURE__*/ _class_private_field_loose_key("_privateField"), _privateFieldValue = /*#__PURE__*/ _class_private_field_loose_key("_privateFieldValue");
class Cl {
    constructor(){
        Object.defineProperty(this, _privateFieldValue, {
            get: get_privateFieldValue,
            set: void 0
        });
        Object.defineProperty(this, _privateField, {
            writable: true,
            value: 0
        });
        _class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue] = 1;
        [_class_private_field_loose_base(this, _privateFieldValue)[_privateFieldValue]] = [
            1
        ];
    }
}
function get_privateFieldValue() {
    return _class_private_field_loose_base(this, _privateField)[_privateField];
}
