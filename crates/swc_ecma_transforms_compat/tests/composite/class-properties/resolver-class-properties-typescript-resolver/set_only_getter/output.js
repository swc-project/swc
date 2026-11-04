var _privateField = /*#__PURE__*/ new WeakMap(), _privateFieldValue = /*#__PURE__*/ new WeakMap();
class Cl {
    get self() {
        this.counter++;
        return this;
    }
    constructor(){
        _class_private_field_init(this, _privateFieldValue, {
            get: get_privateFieldValue,
            set: void 0
        });
        _class_private_field_init(this, _privateField, {
            writable: true,
            value: 0
        });
        _define_property(this, "counter", 0);
        this.self, _read_only_error("#privateFieldValue");
        [_class_private_field_destructure(this.self, _privateFieldValue).value] = [
            1
        ];
    }
}
function get_privateFieldValue() {
    return _class_private_field_get(this, _privateField);
}
const cl = new Cl();
