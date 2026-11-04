var _serialization = /*#__PURE__*/ new WeakMap();
class Test {
    _packet(raw) {
        pak = _class_private_field_get(this, _serialization).decode(raw);
    }
    constructor(){
        _class_private_field_init(this, _serialization, {
            writable: true,
            value: void 0
        });
    }
}
