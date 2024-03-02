var _ws = /*#__PURE__*/ new WeakMap(), _serialization = /*#__PURE__*/ new WeakMap(), _seq = /*#__PURE__*/ new WeakMap();
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
                this.emit(ShardEvent.READY);
                this.session.id = pak.d.session_id;
                this.expectedGuilds = new Set(pak.d.guilds.map((g)=>g.id));
                this.status = Status.WAITING_FOR_GUILDS;
                this.heartbeat.acked = true;
                this.heartbeat.new('ready');
                break;
            case 'RESUMED':
                /**
                * Emitted when a shards connection has been resumed.
                * @event Shard#resumed
                */ this.emit(ShardEvent.RESUMED);
                this.status = Status.READY;
                this.heartbeat.acked = true;
                this.heartbeat.new('resumed');
                break;
        }
        if (pak.s !== null) {
            if (_class_private_field_get(this, _seq) !== -1 && pak.s > _class_private_field_get(this, _seq) + 1) {
                this._debug(`Non-consecutive sequence [${_class_private_field_get(this, _seq)} => ${pak.s}]`);
            }
            _class_private_field_set(this, _seq, pak.s);
        }
        switch(pak.op){
            case GatewayOp.HELLO:
                this.heartbeat.delay = pak.d.heartbeat_interval;
                this.session.hello();
                break;
            case GatewayOp.RECONNECT:
                this._debug('Gateway asked us to reconnect.');
                this.destroy({
                    code: 4000
                });
                break;
            case GatewayOp.INVALID_SESSION:
                this._debug(`Invalid Session: Resumable => ${pak.d}`);
                if (pak.d) {
                    this.session.resume();
                    break;
                }
                _class_private_field_set(this, _seq, -1);
                this.session.reset();
                this.status = Status.RECONNECTING;
                this.emit(ShardEvent.INVALID_SESSION);
                break;
            case GatewayOp.HEARTBEAT:
                this.heartbeat.new('requested');
                break;
            case GatewayOp.HEARTBEAT_ACK:
                this.heartbeat.ack();
                break;
            default:
                if (this.status === Status.WAITING_FOR_GUILDS && pak.t === 'GUILD_CREATE') {
                    this.expectedGuilds.delete(pak.d.id);
                    this._checkReady();
                }
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
        _class_private_field_init(this, _seq, {
            writable: true,
            value: void 0
        });
    }
}
