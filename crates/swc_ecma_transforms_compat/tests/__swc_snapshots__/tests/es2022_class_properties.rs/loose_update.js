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
    get publicFieldValue() {
        return this.publicField;
    }
    set publicFieldValue(newValue) {
        this.publicField = newValue;
    }
    testUpdates() {
        var _this, _this1, _this2, _this3, _this4, _this5, _this6, _this7, _this8, _this9;
        _class_private_field_set(this, _privateField, 0);
        this.publicField = 0;
        _this2 = this, _privateFieldValue.get(_this2).set.call(_this2, (_this = this, _this1 = _privateFieldValue.get(_this).get.call(_this), _privateFieldValue.get(_this).set.call(_this, _this1 + (typeof _this1 === "bigint" ? 1n : 1)), _this1));
        this.publicFieldValue = this.publicFieldValue++;
        _this3 = this, _this4 = (_this5 = _privateFieldValue.get(_this3).get.call(_this3)) + (typeof _this5 === "bigint" ? 1n : 1), _privateFieldValue.get(_this3).set.call(_this3, _this4), _this4;
        ++this.publicFieldValue;
        _this6 = this, _privateFieldValue.get(_this6).set.call(_this6, _privateFieldValue.get(_this6).get.call(_this6) + 1);
        this.publicFieldValue += 1;
        _this9 = this, _privateFieldValue.get(_this9).set.call(_this9, -((_this7 = this, _privateFieldValue.get(_this7).get.call(_this7)) ** (_this8 = this, _privateFieldValue.get(_this8).get.call(_this8))));
        this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
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
