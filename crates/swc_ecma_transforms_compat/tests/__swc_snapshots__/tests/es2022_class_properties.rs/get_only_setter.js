var _privateField = new WeakMap(), _privateFieldValue = new WeakMap();
class Cl {
    constructor(){
        _privateFieldValue.set(this, {
            get: void 0,
            set: set_privateFieldValue
        });
        _class_private_field_init(this, _privateField, {
            writable: true,
            value: 0
        });
        this.publicField = _class_private_field_get(this, _privateFieldValue);
    }
}
function set_privateFieldValue(newValue) {
    _class_private_field_set(this, _privateField, newValue);
}
