var _ws = /*#__PURE__*/ new WeakMap(), _serialization = /*#__PURE__*/ new WeakMap();
class Test {
    _packet(raw) {
        /** @type {DiscordPacket} */ let pak;
        try {
            pak = _class_private_field_get(this, _serialization).decode(raw);
        } catch (e) {
            return;
        }
    }
    constructor(){
        _class_private_field_init(this, _ws, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _serialization, {
            writable: true,
            value: void 0
        });
    }
}
