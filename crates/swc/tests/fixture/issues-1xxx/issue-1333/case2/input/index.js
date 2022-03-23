/*
 * Copyright (c) 2020. MeLike2D All Rights Reserved.
 * Neo is licensed under the MIT License.
 * See the LICENSE file in the project root for more details.
 */

import WebSocket from "ws";

import { Bucket, ClientEvent, Emitter, GatewayCloseCode, GatewayOp, ShardEvent, Status, Timers } from "../../utils";
import { Heartbeat, Session } from "./connection";
import { Serialization } from "./serialization";
import { Compression } from "./compression";

const connectionStates = Object.keys(WebSocket);

export class Shard extends Emitter {
    /**
     * The serialization handler.
     * @type {Serialization}
     */
    #serialization;

    /**
     * The compression handler.
     * @type {Compression}
     */
    #compression;

    /**
     * The current sequence.
     * @type {number}
     */
    #seq;

    /**
     * The shard sequence when the websocket last closed.
     * @type {number}
     */
    #closingSeq;

    /**
     * The rate-limit bucket.
     * @type {Bucket}
     */
    #bucket;

    /**
     * The rate-limit bucket for presence updates.
     * @type {Bucket}
     */
    #presenceBucket;

    /**
     * The current connection.
     * @type {WebSocket}
     */
    #ws;

    /**
     * Packets that are waiting to be sent.
     * @type {DiscordPacket[]}
     */
    #queue;

    /**
     * @param {ShardManager} manager The shard manager.
     * @param {number} id The ID of this shard.
     */
    constructor(manager, id) {
        super();

        /**
         * The sharding manager.
         * @type {ShardManager}
         */
        this.manager = manager;

        /**
         * The ID of this shard.
         * @type {number}
         */
        this.id = id;

        /**
         * The session stuff for this shard.
         * @type {Session}
         */
        this.session = new Session(this);

        /**
         * The heartbeat stuff for this shard.
         * @type {Heartbeat}
         */
        this.heartbeat = new Heartbeat(this);

        /**
         * The latency of this shard.
         * @type {number}
         */
        this.latency = 0;

        /**
         * The status of this shard.
         * @type {Status}
         */
        this.status = Status.IDLE;

        /**
         * Guilds that are expected to be received.
         * @type {Set<string>}
         */
        this.expectedGuilds = new Set();

        // Private shit
        this.#seq = -1;
        this.#closingSeq = 0;
        this.#queue = [];
        this.#bucket = new Bucket(120, 6e4, { reservedTokens: 5 });
        this.#presenceBucket = new Bucket(5, 6e4);
    }

    /**
     * The current sequence
     * @type {number}
     */
    get seq() {
        return this.#seq;
    }

    /**
     * The closing sequence.
     * @type {number}
     */
    get closingSeq() {
        return this.#closingSeq;
    }

    /**
     * The client instance.
     * @type {Client}
     */
    get client() {
        return this.manager.client;
    }

    /**
     * Whether this shard is connected to the gateway or not.
     * @type {boolean}
     */
    get connected() {
        return this.#ws && this.#ws.readyState === WebSocket.OPEN;
    }

    /**
     * Send a new packet to the discord gateway.
     * @param {DiscordPacket} data The packet to send.
     * @param {boolean} [prioritized=false] Whether to prioritize this packet.
     */
    send(data, prioritized = false) {
        if (this.connected) {
            let _i = 0, _w = 1;
            const func = () => {
                if (++_i < _w) {
                    return;
                }

                const encoded = this.#serialization.encode(data);
                this.#ws.send(encoded);
            };

            if (data.op === GatewayOp.PRESENCE_UPDATE) {
                ++_w;
                this.#presenceBucket.queue(func, prioritized);
            }

            return this.#bucket.queue(func, prioritized);
        }

        this.#queue[prioritized ? "unshift" : "push"](data);
    }

    /**
     * Destroys this shard.
     * @param {ShardDestroyOptions} [options={}]
     */
    destroy({ code = 1000, emit = true, log = true, reset = false } = {}) {
        if (log) {
            this._debug(
                `Destroying; Code = ${code}, Resetting? = ${reset ? "yes" : "no"}`
            );
        }

        // (Step 0) Reset some of the session/heartbeat stuff.
        this.heartbeat.reset();
        this.session.clearHelloTimeout();

        // (Step 1) Close the websocket connection.
        if (this.#ws) {
            if (this.#ws.readyState === WebSocket.OPEN) {
                this.#ws.close(code);
            } else {
                this._debug(`Ws State: ${connectionStates[this.#ws.readyState]}`);
                this._cleanupConnection();

                try {
                    this.#ws.close(code);
                } catch {
                    // no-op
                }

                if (emit) {
                    /**
                     * Emitted whenever the shard was destroyed.
                     * @event Shard#destroyed
                     */
                    this.emit(ShardEvent.DESTROYED);
                }
            }
        } else if (emit) {
            this.emit(ShardEvent.DESTROYED);
        }

        // (Step 3) Make the websocket connection prop undefined.
        this.#ws = undefined;

        // (Step 4) Set the shard status to disconnected.
        this.status = Status.DISCONNECTED;

        // (Step 5) Cache ze current sequence!
        if (this.#seq !== -1) {
            this.#closingSeq = this.#seq;
        }

        // (Step 6) Reset the shit.
        if (reset) {
            this.#seq = -1;
            this.session.reset();
        }

        // (Step 7) Reset ze bucket!
        this.#bucket = new Bucket(120, 6e4);
    }

    connect() {
        /* Step 0 - Check if a connection already exists. If so identify the session. */
        if (this.connected) {
            this._debug("A connection is already present, attempting to identify.");
            this.session.identify();
            return;
        }

        /* Step 1 - If a socket is already present, destroy it. */
        if (this.#ws) {
            this._debug("A connection is already present, cleaning up...");
            this.destroy({ emit: false });
        }

        /* Step 2 - Setup serialization and compression. */
        const qs = new URLSearchParams();
        qs.append("v", this.manager.options.version.toString());

        // Step 2.1 - Serialization
        const encoding = this.manager.options.useEtf ? "etf" : "json";
        qs.append("encoding", encoding);
        this.#serialization = Serialization.create(encoding);

        // Step 2.2 - Compression
        if (this.manager.compression) {
            this.#compression = Compression.create(this.manager.compression)
                .on("data", (buffer) => this._packet(buffer))
                .on("error", (error) => this.emit(ShardEvent.ERROR, error))
                .on("debug", (message) => this._debug(message));

            qs.append("compress", "zlib-stream");
        }

        /* Step 5 - Set the status and wait for the hello op code. */
        this.status =
            this.status === Status.DISCONNECTED
                ? Status.RECONNECTING
                : Status.CONNECTING;
        this.session.setHelloTimeout();

        /**
         * The timestamp in which this shard connected.
         * @type {number}
         */
        this.connectedAt = Date.now();

        /* Step 6 - Connect to the gateway. */
        const uri = this.manager.gatewayUrl.replace(/\/*$/m, "");
        this.#ws = new WebSocket(`${uri}/?${qs}`);

        /* Step 7 - Attach the listeners. */
        this.#ws.onopen = this._open.bind(this);
        this.#ws.onclose = this._close.bind(this);
        this.#ws.onerror = this._error.bind(this);
        this.#ws.onmessage = this._message.bind(this);
    }

    _packet(raw) {
        /** @type {DiscordPacket} */
        let pak;
        try {
            pak = this.#serialization.decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }

        switch (pak.t) {
            case "READY":
                /**
                 * Emitted whenever the Shard receives the READY payload.
                 * @event Shard#ready
                 */
                this.emit(ShardEvent.READY);

                this.session.id = pak.d.session_id;
                this.expectedGuilds = new Set(pak.d.guilds.map((g) => g.id));
                this.status = Status.WAITING_FOR_GUILDS;

                this.heartbeat.acked = true;
                this.heartbeat.new("ready");
                break;
            case "RESUMED":
                /**
                 * Emitted when a shards connection has been resumed.
                 * @event Shard#resumed
                 */
                this.emit(ShardEvent.RESUMED);

                this.status = Status.READY;
                this.heartbeat.acked = true;
                this.heartbeat.new("resumed");
                break;
        }

        if (pak.s !== null) {
            if (this.#seq !== -1 && pak.s > this.#seq + 1) {
                this._debug(`Non-consecutive sequence [${this.#seq} => ${pak.s}]`);
            }

            this.#seq = pak.s;
        }

        switch (pak.op) {
            case GatewayOp.HELLO:
                this.heartbeat.delay = pak.d.heartbeat_interval;
                this.session.hello();
                break;
            case GatewayOp.RECONNECT:
                this._debug("Gateway asked us to reconnect.");
                this.destroy({ code: 4000 });
                break;
            case GatewayOp.INVALID_SESSION:
                this._debug(`Invalid Session: Resumable => ${pak.d}`);
                if (pak.d) {
                    this.session.resume();
                    break;
                }

                this.#seq = -1;
                this.session.reset();
                this.status = Status.RECONNECTING;

                this.emit(ShardEvent.INVALID_SESSION);
                break;
            case GatewayOp.HEARTBEAT:
                this.heartbeat.new("requested");
                break;
            case GatewayOp.HEARTBEAT_ACK:
                this.heartbeat.ack();
                break;
            default:
                if (
                    this.status === Status.WAITING_FOR_GUILDS &&
                    pak.t === "GUILD_CREATE"
                ) {
                    this.expectedGuilds.delete(pak.d.id);
                    this._checkReady();
                }
        }
    }

    _checkReady() {
        if (this._readyTimeout) {
            Timers.clearTimeout(this._readyTimeout);
            delete this._readyTimeout;
        }

        if (!this.expectedGuilds.size) {
            this._debug("Received all guilds. Marking as full-ready.");
            this.status = Status.READY;
            return this.emit(ShardEvent.FULL_READY);
        }

        /**
         * The ready timeout.
         * @type {NodeJS.Timeout}
         * @private
         */
        this._readyTimeout = Timers.setTimeout(() => {
            this._debug("Didn't receive any more guilds within 15 seconds.");

            this.status = Status.READY;
            delete this._readyTimeout;

            this.emit(ShardEvent.FULL_READY, this.expectedGuilds);
        }, 15e3);
    }

    /**
     * Called whenever the websocket opens.
     * @private
     */
    _open() {
        this.status = Status.HANDSHAKING;
        this._debug(
            `Connected. ${this.#ws?.url} in ${Date.now() - this.connectedAt}`
        );

        if (this.#queue.length) {
            this._debug(`${this.#queue.length} packets waiting... sending all now.`);
            while (this.#queue.length) {
                const pk = this.#queue.shift();
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
     */
    _error(event) {
        const error = event.error ? event.error : event;
        if (error) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, error, this);
        }
    }

    /**
     * Called whenever the websocket closes.
     * @param {WebSocket.CloseEvent} evt
     * @private
     */
    _close(evt) {
        const reason = (evt.reason || GatewayCloseCode[evt.code]) ?? "unknown";
        this._debug(
            `Closed; Code = ${evt.code}, Clean? = ${evt.wasClean}, Reason = ${reason}`
        );

        if (this.#seq !== -1) {
            this.#closingSeq = this.#seq;
        }

        this.#seq = -1;
        this.heartbeat.reset();
        this.session.clearHelloTimeout();

        if (this.#ws) {
            this._cleanupConnection();
        }

        this.status = Status.DISCONNECTED;

        /**
         * Emitted whenever the shard's websocket closes.
         * @event Shard#close
         * @param {WebSocket.CloseEvent} event The received event
         */
        this.emit(ShardEvent.CLOSE, evt);
    }

    /**
     * Called whenever the websocket receives a message.
     * @param {WebSocket.MessageEvent} evt
     * @private
     */
    _message(evt) {
        return this.#compression
            ? this.#compression.add(evt.data)
            : this._packet(evt.data);
    }

    /**
     * Cleans up the WebSocket connection listeners.
     * @private
     */
    _cleanupConnection() {
        this.#ws.onopen = this.#ws.onclose = this.#ws.onerror = this.#ws.onmessage = null;
    }

    /**
     * Used for debugging shard stuff.
     * @param {string} message The debug message.
     * @private
     */
    _debug(message) {
        return this.manager._debug(message, this);
    }
}

/**
 * @typedef {Object} DiscordPacket
 * @property {number} [op]
 * @property {*} [d]
 * @property {number | null} [s]
 * @property {string} [t]
 */

/**
 * @typedef {Object} ShardDestroyOptions
 * @property {boolean} [reset=false] Whether to reset the shard.
 * @property {boolean} [emit=true] Whether to emit the "destroyed" event.
 * @property {boolean} [log=false] Whether to emit a debug log.
 * @property {number} [code=1000] The code to use.
 */