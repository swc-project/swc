var _privateField = new WeakMap(), _privateFieldValue = new WeakMap();
class Cl {
    get self() {
        this.counter++;
        return this;
    }
    constructor(){
        var _this_self;
        _privateFieldValue.set(this, {
            get: get_privateFieldValue,
            set: void 0
        });
        _class_private_field_init(this, _privateField, {
            writable: true,
            value: 0
        });
        _define_property(this, "counter", 0);
        _class_private_field_set(this.self, _privateFieldValue, 1);
        [_this_self = this.self, _privateFieldValue.get(_this_self).get.call(_this_self)] = [
            1
        ];
    }
}
function get_privateFieldValue() {
    return _class_private_field_get(this, _privateField);
}
const cl = new Cl();
