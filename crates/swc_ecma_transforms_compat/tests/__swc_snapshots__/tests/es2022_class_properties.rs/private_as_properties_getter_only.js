var _privateField = new WeakMap(), _privateFieldValue = new WeakMap();
class Cl {
    constructor(){
        var _this;
        _privateFieldValue.set(this, {
            get: get_privateFieldValue,
            set: void 0
        });
        _class_private_field_init(this, _privateField, {
            writable: true,
            value: 0
        });
        _class_private_field_set(this, _privateFieldValue, 1);
        [_this = this, _privateFieldValue.get(_this).get.call(_this)] = [
            1
        ];
    }
}
function get_privateFieldValue() {
    return _class_private_field_get(this, _privateField);
}
