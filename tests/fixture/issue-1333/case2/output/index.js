"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _ws1 = _interopRequireDefault(require("ws"));
var _utils = require("../../utils");
var _connection = require("./connection");
var _serialization1 = require("./serialization");
var _compression1 = require("./compression");
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const connectionStates = Object.keys(_ws1.default);
class Shard extends _utils.Emitter {
    /**
     * The current sequence
     * @type {number}
     */ get seq() {
        return _classPrivateFieldGet(this, _seq);
    }
    /**
     * The closing sequence.
     * @type {number}
     */ get closingSeq() {
        return _classPrivateFieldGet(this, _closingSeq);
    }
    /**
     * The client instance.
     * @type {Client}
     */ get client() {
        return this.manager.client;
    }
    /**
     * Whether this shard is connected to the gateway or not.
     * @type {boolean}
     */ get connected() {
        return _classPrivateFieldGet(this, _ws2) && _classPrivateFieldGet(this, _ws2).readyState === _ws1.default.OPEN;
    }
    /**
     * Send a new packet to the discord gateway.
     * @param {DiscordPacket} data The packet to send.
     * @param {boolean} [prioritized=false] Whether to prioritize this packet.
     */ send(data, prioritized = false) {
        if (this.connected) {
            let _i = 0, _w = 1;
            const func = ()=>{
                if ((++_i) < _w) {
                    return;
                }
                const encoded = _classPrivateFieldGet(this, _serialization2).encode(data);
                _classPrivateFieldGet(this, _ws2).send(encoded);
            };
            if (data.op === _utils.GatewayOp.PRESENCE_UPDATE) {
                ++_w;
                _classPrivateFieldGet(this, _presenceBucket).queue(func, prioritized);
            }
            return _classPrivateFieldGet(this, _bucket).queue(func, prioritized);
        }
        _classPrivateFieldGet(this, _queue)[prioritized ? "unshift" : "push"](data);
    }
    /**
     * Destroys this shard.
     * @param {ShardDestroyOptions} [options={}]
     */ destroy({ code =1000 , emit =true , log =true , reset =false  } = {
    }) {
        if (log) {
            this._debug(`Destroying; Code = ${code}, Resetting? = ${reset ? "yes" : "no"}`);
        }
        // (Step 0) Reset some of the session/heartbeat stuff.
        this.heartbeat.reset();
        this.session.clearHelloTimeout();
        // (Step 1) Close the websocket connection.
        if (_classPrivateFieldGet(this, _ws2)) {
            if (_classPrivateFieldGet(this, _ws2).readyState === _ws1.default.OPEN) {
                _classPrivateFieldGet(this, _ws2).close(code);
            } else {
                this._debug(`Ws State: ${connectionStates[_classPrivateFieldGet(this, _ws2).readyState]}`);
                this._cleanupConnection();
                try {
                    _classPrivateFieldGet(this, _ws2).close(code);
                } catch  {
                // no-op
                }
                if (emit) {
                    /**
                     * Emitted whenever the shard was destroyed.
                     * @event Shard#destroyed
                     */ this.emit(_utils.ShardEvent.DESTROYED);
                }
            }
        } else if (emit) {
            this.emit(_utils.ShardEvent.DESTROYED);
        }
        _classPrivateFieldSet(this, _ws2, undefined);
        // (Step 4) Set the shard status to disconnected.
        this.status = _utils.Status.DISCONNECTED;
        // (Step 5) Cache ze current sequence!
        if (_classPrivateFieldGet(this, _seq) !== -1) {
            _classPrivateFieldSet(this, _closingSeq, _classPrivateFieldGet(this, _seq));
        }
        // (Step 6) Reset the shit.
        if (reset) {
            _classPrivateFieldSet(this, _seq, -1);
            this.session.reset();
        }
        _classPrivateFieldSet(this, _bucket, new _utils.Bucket(120, 60000));
    }
    connect() {
        /* Step 0 - Check if a connection already exists. If so identify the session. */ if (this.connected) {
            this._debug("A connection is already present, attempting to identify.");
            this.session.identify();
            return;
        }
        /* Step 1 - If a socket is already present, destroy it. */ if (_classPrivateFieldGet(this, _ws2)) {
            this._debug("A connection is already present, cleaning up...");
            this.destroy({
                emit: false
            });
        }
        /* Step 2 - Setup serialization and compression. */ const qs = new URLSearchParams();
        qs.append("v", this.manager.options.version.toString());
        // Step 2.1 - Serialization
        const encoding = this.manager.options.useEtf ? "etf" : "json";
        qs.append("encoding", encoding);
        _classPrivateFieldSet(this, _serialization2, _serialization1.Serialization.create(encoding));
        // Step 2.2 - Compression
        if (this.manager.compression) {
            _classPrivateFieldSet(this, _compression2, _compression1.Compression.create(this.manager.compression).on("data", (buffer)=>this._packet(buffer)
            ).on("error", (error)=>this.emit(_utils.ShardEvent.ERROR, error)
            ).on("debug", (message)=>this._debug(message)
            ));
            qs.append("compress", "zlib-stream");
        }
        /* Step 5 - Set the status and wait for the hello op code. */ this.status = this.status === _utils.Status.DISCONNECTED ? _utils.Status.RECONNECTING : _utils.Status.CONNECTING;
        this.session.setHelloTimeout();
        /**
         * The timestamp in which this shard connected.
         * @type {number}
         */ this.connectedAt = Date.now();
        /* Step 6 - Connect to the gateway. */ const uri = this.manager.gatewayUrl.replace(/\/*$/m, "");
        _classPrivateFieldSet(this, _ws2, new _ws1.default(`${uri}/?${qs}`));
        /* Step 7 - Attach the listeners. */ _classPrivateFieldGet(this, _ws2).onopen = this._open.bind(this);
        _classPrivateFieldGet(this, _ws2).onclose = this._close.bind(this);
        _classPrivateFieldGet(this, _ws2).onerror = this._error.bind(this);
        _classPrivateFieldGet(this, _ws2).onmessage = this._message.bind(this);
    }
    _packet(raw) {
        /** @type {DiscordPacket} */ let pak;
        try {
            pak = _classPrivateFieldGet(this, _serialization2).decode(raw);
            this.manager.emit(_utils.ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(_utils.ClientEvent.SHARD_ERROR, e, this);
            return;
        }
        switch(pak.t){
            case "READY":
                /**
                 * Emitted whenever the Shard receives the READY payload.
                 * @event Shard#ready
                 */ this.emit(_utils.ShardEvent.READY);
                this.session.id = pak.d.session_id;
                this.expectedGuilds = new Set(pak.d.guilds.map((g)=>g.id
                ));
                this.status = _utils.Status.WAITING_FOR_GUILDS;
                this.heartbeat.acked = true;
                this.heartbeat.new("ready");
                break;
            case "RESUMED":
                /**
                 * Emitted when a shards connection has been resumed.
                 * @event Shard#resumed
                 */ this.emit(_utils.ShardEvent.RESUMED);
                this.status = _utils.Status.READY;
                this.heartbeat.acked = true;
                this.heartbeat.new("resumed");
                break;
        }
        if (pak.s !== null) {
            if (_classPrivateFieldGet(this, _seq) !== -1 && pak.s > _classPrivateFieldGet(this, _seq) + 1) {
                this._debug(`Non-consecutive sequence [${_classPrivateFieldGet(this, _seq)} => ${pak.s}]`);
            }
            _classPrivateFieldSet(this, _seq, pak.s);
        }
        switch(pak.op){
            case _utils.GatewayOp.HELLO:
                this.heartbeat.delay = pak.d.heartbeat_interval;
                this.session.hello();
                break;
            case _utils.GatewayOp.RECONNECT:
                this._debug("Gateway asked us to reconnect.");
                this.destroy({
                    code: 4000
                });
                break;
            case _utils.GatewayOp.INVALID_SESSION:
                this._debug(`Invalid Session: Resumable => ${pak.d}`);
                if (pak.d) {
                    this.session.resume();
                    break;
                }
                _classPrivateFieldSet(this, _seq, -1);
                this.session.reset();
                this.status = _utils.Status.RECONNECTING;
                this.emit(_utils.ShardEvent.INVALID_SESSION);
                break;
            case _utils.GatewayOp.HEARTBEAT:
                this.heartbeat.new("requested");
                break;
            case _utils.GatewayOp.HEARTBEAT_ACK:
                this.heartbeat.ack();
                break;
            default:
                if (this.status === _utils.Status.WAITING_FOR_GUILDS && pak.t === "GUILD_CREATE") {
                    this.expectedGuilds.delete(pak.d.id);
                    this._checkReady();
                }
        }
    }
    _checkReady() {
        if (this._readyTimeout) {
            _utils.Timers.clearTimeout(this._readyTimeout);
            delete this._readyTimeout;
        }
        if (!this.expectedGuilds.size) {
            this._debug("Received all guilds. Marking as full-ready.");
            this.status = _utils.Status.READY;
            return this.emit(_utils.ShardEvent.FULL_READY);
        }
        /**
         * The ready timeout.
         * @type {NodeJS.Timeout}
         * @private
         */ this._readyTimeout = _utils.Timers.setTimeout(()=>{
            this._debug("Didn't receive any more guilds within 15 seconds.");
            this.status = _utils.Status.READY;
            delete this._readyTimeout;
            this.emit(_utils.ShardEvent.FULL_READY, this.expectedGuilds);
        }, 15000);
    }
    /**
     * Called whenever the websocket opens.
     * @private
     */ _open() {
        var ref;
        this.status = _utils.Status.HANDSHAKING;
        this._debug(`Connected. ${(ref = _classPrivateFieldGet(this, _ws2)) === null || ref === void 0 ? void 0 : ref.url} in ${Date.now() - this.connectedAt}`);
        if (_classPrivateFieldGet(this, _queue).length) {
            this._debug(`${_classPrivateFieldGet(this, _queue).length} packets waiting... sending all now.`);
            while(_classPrivateFieldGet(this, _queue).length){
                const pk = _classPrivateFieldGet(this, _queue).shift();
                if (!pk) {
                    break;
                }
                this.send(pk);
            }
        }
    }
    /**
     * Called whenever the websocket encounters an error.
     * @param {WebSocket.ErrorEvent} event
     * @private
     */ _error(event) {
        const error = event.error ? event.error : event;
        if (error) {
            this.manager.client.emit(_utils.ClientEvent.SHARD_ERROR, error, this);
        }
    }
    /**
     * Called whenever the websocket closes.
     * @param {WebSocket.CloseEvent} evt
     * @private
     */ _close(evt) {
        var ref;
        const reason = (ref = evt.reason || _utils.GatewayCloseCode[evt.code]) !== null && ref !== void 0 ? ref : "unknown";
        this._debug(`Closed; Code = ${evt.code}, Clean? = ${evt.wasClean}, Reason = ${reason}`);
        if (_classPrivateFieldGet(this, _seq) !== -1) {
            _classPrivateFieldSet(this, _closingSeq, _classPrivateFieldGet(this, _seq));
        }
        _classPrivateFieldSet(this, _seq, -1);
        this.heartbeat.reset();
        this.session.clearHelloTimeout();
        if (_classPrivateFieldGet(this, _ws2)) {
            this._cleanupConnection();
        }
        this.status = _utils.Status.DISCONNECTED;
        /**
         * Emitted whenever the shard's websocket closes.
         * @event Shard#close
         * @param {WebSocket.CloseEvent} event The received event
         */ this.emit(_utils.ShardEvent.CLOSE, evt);
    }
    /**
     * Called whenever the websocket receives a message.
     * @param {WebSocket.MessageEvent} evt
     * @private
     */ _message(evt) {
        return _classPrivateFieldGet(this, _compression2) ? _classPrivateFieldGet(this, _compression2).add(evt.data) : this._packet(evt.data);
    }
    /**
     * Cleans up the WebSocket connection listeners.
     * @private
     */ _cleanupConnection() {
        _classPrivateFieldGet(this, _ws2).onopen = _classPrivateFieldGet(this, _ws2).onclose = _classPrivateFieldGet(this, _ws2).onerror = _classPrivateFieldGet(this, _ws2).onmessage = null;
    }
    /**
     * Used for debugging shard stuff.
     * @param {string} message The debug message.
     * @private
     */ _debug(message) {
        return this.manager._debug(message, this);
    }
    /**
     * @param {ShardManager} manager The shard manager.
     * @param {number} id The ID of this shard.
     */ constructor(manager, id){
        super();
        /**
     * The serialization handler.
     * @type {Serialization}
     */ _serialization2.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * The compression handler.
     * @type {Compression}
     */ _compression2.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * The current sequence.
     * @type {number}
     */ _seq.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * The shard sequence when the websocket last closed.
     * @type {number}
     */ _closingSeq.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * The rate-limit bucket.
     * @type {Bucket}
     */ _bucket.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * The rate-limit bucket for presence updates.
     * @type {Bucket}
     */ _presenceBucket.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * The current connection.
     * @type {WebSocket}
     */ _ws2.set(this, {
            writable: true,
            value: void 0
        });
        /**
     * Packets that are waiting to be sent.
     * @type {DiscordPacket[]}
     */ _queue.set(this, {
            writable: true,
            value: void 0
        });
        /**
         * The sharding manager.
         * @type {ShardManager}
         */ this.manager = manager;
        /**
         * The ID of this shard.
         * @type {number}
         */ this.id = id;
        /**
         * The session stuff for this shard.
         * @type {Session}
         */ this.session = new _connection.Session(this);
        /**
         * The heartbeat stuff for this shard.
         * @type {Heartbeat}
         */ this.heartbeat = new _connection.Heartbeat(this);
        /**
         * The latency of this shard.
         * @type {number}
         */ this.latency = 0;
        /**
         * The status of this shard.
         * @type {Status}
         */ this.status = _utils.Status.IDLE;
        /**
         * Guilds that are expected to be received.
         * @type {Set<string>}
         */ this.expectedGuilds = new Set();
        _classPrivateFieldSet(this, _seq, -1);
        _classPrivateFieldSet(this, _closingSeq, 0);
        _classPrivateFieldSet(this, _queue, []);
        _classPrivateFieldSet(this, _bucket, new _utils.Bucket(120, 60000, {
            reservedTokens: 5
        }));
        _classPrivateFieldSet(this, _presenceBucket, new _utils.Bucket(5, 60000));
    }
} /**
 * @typedef {Object} DiscordPacket
 * @property {number} [op]
 * @property {*} [d]
 * @property {number | null} [s]
 * @property {string} [t]
 */  /**
 * @typedef {Object} ShardDestroyOptions
 * @property {boolean} [reset=false] Whether to reset the shard.
 * @property {boolean} [emit=true] Whether to emit the "destroyed" event.
 * @property {boolean} [log=false] Whether to emit a debug log.
 * @property {number} [code=1000] The code to use.
 */ 
exports.Shard = Shard;
var _serialization2 = new WeakMap();
var _compression2 = new WeakMap();
var _seq = new WeakMap();
var _closingSeq = new WeakMap();
var _bucket = new WeakMap();
var _presenceBucket = new WeakMap();
var _ws2 = new WeakMap();
var _queue = new WeakMap();
