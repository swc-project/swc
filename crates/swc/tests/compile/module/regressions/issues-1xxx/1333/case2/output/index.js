/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Shard", {
    enumerable: true,
    get: function() {
        return Shard;
    }
});
const _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
const _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
const _class_private_field_set = require("@swc/helpers/_/_class_private_field_set");
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _ws = /*#__PURE__*/ _interop_require_default._(require("ws"));
const _utils = require("../../utils");
const _connection = require("./connection");
const _serialization = require("./serialization");
const _compression = require("./compression");
const connectionStates = Object.keys(_ws.default);
var /**
     * The serialization handler.
     * @type {Serialization}
     */ _serialization1 = /*#__PURE__*/ new WeakMap(), /**
     * The compression handler.
     * @type {Compression}
     */ _compression1 = /*#__PURE__*/ new WeakMap(), /**
     * The current sequence.
     * @type {number}
     */ _seq = /*#__PURE__*/ new WeakMap(), /**
     * The shard sequence when the websocket last closed.
     * @type {number}
     */ _closingSeq = /*#__PURE__*/ new WeakMap(), /**
     * The rate-limit bucket.
     * @type {Bucket}
     */ _bucket = /*#__PURE__*/ new WeakMap(), /**
     * The rate-limit bucket for presence updates.
     * @type {Bucket}
     */ _presenceBucket = /*#__PURE__*/ new WeakMap(), /**
     * The current connection.
     * @type {WebSocket}
     */ _ws1 = /*#__PURE__*/ new WeakMap(), /**
     * Packets that are waiting to be sent.
     * @type {DiscordPacket[]}
     */ _queue = /*#__PURE__*/ new WeakMap();
class Shard extends _utils.Emitter {
    /**
     * The current sequence
     * @type {number}
     */ get seq() {
        return _class_private_field_get._(this, _seq);
    }
    /**
     * The closing sequence.
     * @type {number}
     */ get closingSeq() {
        return _class_private_field_get._(this, _closingSeq);
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
        return _class_private_field_get._(this, _ws1) && _class_private_field_get._(this, _ws1).readyState === _ws.default.OPEN;
    }
    /**
     * Send a new packet to the discord gateway.
     * @param {DiscordPacket} data The packet to send.
     * @param {boolean} [prioritized=false] Whether to prioritize this packet.
     */ send(data, prioritized = false) {
        if (this.connected) {
            let _i = 0, _w = 1;
            const func = ()=>{
                if (++_i < _w) {
                    return;
                }
                const encoded = _class_private_field_get._(this, _serialization1).encode(data);
                _class_private_field_get._(this, _ws1).send(encoded);
            };
            if (data.op === _utils.GatewayOp.PRESENCE_UPDATE) {
                ++_w;
                _class_private_field_get._(this, _presenceBucket).queue(func, prioritized);
            }
            return _class_private_field_get._(this, _bucket).queue(func, prioritized);
        }
        _class_private_field_get._(this, _queue)[prioritized ? "unshift" : "push"](data);
    }
    /**
     * Destroys this shard.
     * @param {ShardDestroyOptions} [options={}]
     */ destroy({ code = 1000, emit = true, log = true, reset = false } = {}) {
        if (log) {
            this._debug(`Destroying; Code = ${code}, Resetting? = ${reset ? "yes" : "no"}`);
        }
        // (Step 0) Reset some of the session/heartbeat stuff.
        this.heartbeat.reset();
        this.session.clearHelloTimeout();
        // (Step 1) Close the websocket connection.
        if (_class_private_field_get._(this, _ws1)) {
            if (_class_private_field_get._(this, _ws1).readyState === _ws.default.OPEN) {
                _class_private_field_get._(this, _ws1).close(code);
            } else {
                this._debug(`Ws State: ${connectionStates[_class_private_field_get._(this, _ws1).readyState]}`);
                this._cleanupConnection();
                try {
                    _class_private_field_get._(this, _ws1).close(code);
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
        // (Step 3) Make the websocket connection prop undefined.
        _class_private_field_set._(this, _ws1, undefined);
        // (Step 4) Set the shard status to disconnected.
        this.status = _utils.Status.DISCONNECTED;
        // (Step 5) Cache ze current sequence!
        if (_class_private_field_get._(this, _seq) !== -1) {
            _class_private_field_set._(this, _closingSeq, _class_private_field_get._(this, _seq));
        }
        // (Step 6) Reset the shit.
        if (reset) {
            _class_private_field_set._(this, _seq, -1);
            this.session.reset();
        }
        // (Step 7) Reset ze bucket!
        _class_private_field_set._(this, _bucket, new _utils.Bucket(120, 6e4));
    }
    connect() {
        /* Step 0 - Check if a connection already exists. If so identify the session. */ if (this.connected) {
            this._debug("A connection is already present, attempting to identify.");
            this.session.identify();
            return;
        }
        /* Step 1 - If a socket is already present, destroy it. */ if (_class_private_field_get._(this, _ws1)) {
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
        _class_private_field_set._(this, _serialization1, _serialization.Serialization.create(encoding));
        // Step 2.2 - Compression
        if (this.manager.compression) {
            _class_private_field_set._(this, _compression1, _compression.Compression.create(this.manager.compression).on("data", (buffer)=>this._packet(buffer)).on("error", (error)=>this.emit(_utils.ShardEvent.ERROR, error)).on("debug", (message)=>this._debug(message)));
            qs.append("compress", "zlib-stream");
        }
        /* Step 5 - Set the status and wait for the hello op code. */ this.status = this.status === _utils.Status.DISCONNECTED ? _utils.Status.RECONNECTING : _utils.Status.CONNECTING;
        this.session.setHelloTimeout();
        /**
         * The timestamp in which this shard connected.
         * @type {number}
         */ this.connectedAt = Date.now();
        /* Step 6 - Connect to the gateway. */ const uri = this.manager.gatewayUrl.replace(/\/*$/m, "");
        _class_private_field_set._(this, _ws1, new _ws.default(`${uri}/?${qs}`));
        /* Step 7 - Attach the listeners. */ _class_private_field_get._(this, _ws1).onopen = this._open.bind(this);
        _class_private_field_get._(this, _ws1).onclose = this._close.bind(this);
        _class_private_field_get._(this, _ws1).onerror = this._error.bind(this);
        _class_private_field_get._(this, _ws1).onmessage = this._message.bind(this);
    }
    _packet(raw) {
        /** @type {DiscordPacket} */ let pak;
        try {
            pak = _class_private_field_get._(this, _serialization1).decode(raw);
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
                this.expectedGuilds = new Set(pak.d.guilds.map((g)=>g.id));
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
            if (_class_private_field_get._(this, _seq) !== -1 && pak.s > _class_private_field_get._(this, _seq) + 1) {
                this._debug(`Non-consecutive sequence [${_class_private_field_get._(this, _seq)} => ${pak.s}]`);
            }
            _class_private_field_set._(this, _seq, pak.s);
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
                _class_private_field_set._(this, _seq, -1);
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
        }, 15e3);
    }
    /**
     * Called whenever the websocket opens.
     * @private
     */ _open() {
        var _class_private_field_get1;
        this.status = _utils.Status.HANDSHAKING;
        this._debug(`Connected. ${(_class_private_field_get1 = _class_private_field_get._(this, _ws1)) === null || _class_private_field_get1 === void 0 ? void 0 : _class_private_field_get1.url} in ${Date.now() - this.connectedAt}`);
        if (_class_private_field_get._(this, _queue).length) {
            this._debug(`${_class_private_field_get._(this, _queue).length} packets waiting... sending all now.`);
            while(_class_private_field_get._(this, _queue).length){
                const pk = _class_private_field_get._(this, _queue).shift();
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
        var _ref;
        const reason = (_ref = evt.reason || _utils.GatewayCloseCode[evt.code]) !== null && _ref !== void 0 ? _ref : "unknown";
        this._debug(`Closed; Code = ${evt.code}, Clean? = ${evt.wasClean}, Reason = ${reason}`);
        if (_class_private_field_get._(this, _seq) !== -1) {
            _class_private_field_set._(this, _closingSeq, _class_private_field_get._(this, _seq));
        }
        _class_private_field_set._(this, _seq, -1);
        this.heartbeat.reset();
        this.session.clearHelloTimeout();
        if (_class_private_field_get._(this, _ws1)) {
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
        return _class_private_field_get._(this, _compression1) ? _class_private_field_get._(this, _compression1).add(evt.data) : this._packet(evt.data);
    }
    /**
     * Cleans up the WebSocket connection listeners.
     * @private
     */ _cleanupConnection() {
        _class_private_field_get._(this, _ws1).onopen = _class_private_field_get._(this, _ws1).onclose = _class_private_field_get._(this, _ws1).onerror = _class_private_field_get._(this, _ws1).onmessage = null;
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
        super(), _class_private_field_init._(this, _serialization1, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _compression1, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _seq, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _closingSeq, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _bucket, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _presenceBucket, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _ws1, {
            writable: true,
            value: void 0
        }), _class_private_field_init._(this, _queue, {
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
        // Private shit
        _class_private_field_set._(this, _seq, -1);
        _class_private_field_set._(this, _closingSeq, 0);
        _class_private_field_set._(this, _queue, []);
        _class_private_field_set._(this, _bucket, new _utils.Bucket(120, 6e4, {
            reservedTokens: 5
        }));
        _class_private_field_set._(this, _presenceBucket, new _utils.Bucket(5, 6e4));
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
