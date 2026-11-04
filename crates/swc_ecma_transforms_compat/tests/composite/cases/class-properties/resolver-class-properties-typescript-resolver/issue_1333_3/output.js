var _ws = /*#__PURE__*/ new WeakMap(), _serialization = /*#__PURE__*/ new WeakMap();
class Test {
    _packet(raw) {
        /** @type {DiscordPacket} */ let pak;
        try {
            pak = _class_private_field_get(this, _serialization).decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }
        switch(pak.t){
            case 'READY':
            case 'RESUMED':
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
