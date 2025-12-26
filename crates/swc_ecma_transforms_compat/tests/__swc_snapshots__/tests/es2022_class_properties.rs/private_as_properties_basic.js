var _privateField = new WeakMap(), _privateFieldValue = new WeakMap();
class Cl {
    publicGetPrivateField() {
        var _this;
        return _this = this, _privateFieldValue.get(_this).get.call(_this);
    }
    publicSetPrivateField(newValue) {
        var _this;
        _this = this, _privateFieldValue.get(_this).set.call(_this, newValue);
    }
    constructor(){
        _privateFieldValue.set(this, {
            get: get_privateFieldValue,
            set: set_privateFieldValue
        });
        _class_private_field_init(this, _privateField, {
            writable: true,
            value: "top secret string"
        });
        this.publicField = "not secret string";
    }
}
function get_privateFieldValue() {
    return _class_private_field_get(this, _privateField);
}
function set_privateFieldValue(newValue) {
    _class_private_field_set(this, _privateField, newValue);
}
