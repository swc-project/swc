"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _abortSignal = require("./misc/AbortSignal");
var _errors = require("../../errors");
var _utils = require("../../utils");
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const headers = [
    "x-ratelimit-limit",
    "x-ratelimit-remaining",
    "x-ratelimit-reset-after",
    "x-ratelimit-reset",
    "via"
];
class RequestHandler {
    /**
     * Whether this handler is inactive or not.
     * @return {boolean}
     */ get inactive() {
        return !_classPrivateFieldGet(this, _queue).remaining && !this._limited;
    }
    /**
     * Whether the rate-limit bucket is currently limited.
     * @return {boolean}
     * @private
     */ get _limited() {
        return this.remaining <= 0 && Date.now() < this.reset;
    }
    /**
     * The time until the rate-limit bucket resets.
     * @private
     */ get _untilReset() {
        return this.reset - Date.now();
    }
    /**
     * Makes a route that can be used as a key.
     * Taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/RequestHandler.js#L46-L54.
     * @param {string} method The method.
     * @param {string} url The URL.
     *
     * @returns {string} The created route.
     */ static makeRoute(method, url) {
        const route = url.replace(/\/([a-z-]+)\/(?:\d{17,19})/g, (match, p)=>[
                "channels",
                "guilds",
                "webhooks"
            ].includes(p) ? match : `/${p}/:id`
        ).replace(/\/reactions\/[^/]+/g, "/reactions/:id").replace(/\/webhooks\/(\d+)\/[\w-]{64,}/, "webhooks/$1/:token").replace(/\?.*$/, "");
        let ending = ";";
        if (method === "delete" && route.endsWith("/message/:id")) {
            var ref;
            const id = (ref = /\d{16,19}$/.exec(route)) === null || ref === void 0 ? void 0 : ref[0];
            const snowflake = _utils.Snowflake.deconstruct(id);
            if (Date.now() - snowflake.timestamp > 1000 * 60 * 60 * 24 * 14) {
                ending += "deletes-old";
            }
        }
        return route + ending;
    }
    /**
     * Converts the response to usable data
     * @param {Response} res
     * @return {* | Promise<any>}
     */ static async parseResponse(res) {
        var ref;
        if ((ref = res.headers.get("Content-Type")) === null || ref === void 0 ? void 0 : ref.startsWith("application/json")) {
            return await res.json();
        }
        return res.buffer();
    }
    /**
     * Pushes a new request into the queue.
     * @param {string} url The request URL.
     * @param {Request} request The request data.
     *
     * @return {Promise<*>}
     */ async push(url, request) {
        await _classPrivateFieldGet(this, _queue).wait();
        try {
            await this.rest.globalTimeout;
            if (this._limited) {
                /**
                 * @typedef {Object} RateLimitedData
                 * @property {number} limit
                 * @property {string} method
                 * @property {string} url
                 *
                 * Emitted whenever a routes rate-lim\it bucket was exceeded.
                 * @event RequestHandler#rate-limited
                 * @property {RateLimitedData} data The rate-limit data.
                 */ this.rest.client.emit(_utils.ClientEvent.LIMITED, {
                    limit: this.limit,
                    method: request.method,
                    url
                });
                await (0, _utils).sleep(this._untilReset);
            }
            return this._make(url, request);
        } finally{
            _classPrivateFieldGet(this, _queue).next();
        }
    }
    /**
     * Makes a new request to the provided url.
     * @param url The request URL.
     * @param {Request} request The request data.
     * @param {number} [tries] The current try.
     *
     * @return {Promise<*>}
     * @private
     */ async _make(url, request, tries = 0) {
        const signal = new _abortSignal.AbortSignal();
        const timeout = _utils.Timers.setTimeout(()=>signal.abort()
        , this.rest.options.timeout);
        let res;
        try {
            res = await (0, _nodeFetch).default(url, {
                ...request,
                signal
            });
        } catch (e) {
            if (e.name === "AbortError" && tries !== this.rest.options.retries) {
                return this._make(url, options, tries++);
            }
            throw e;
        } finally{
            _utils.Timers.clearTimeout(timeout);
        }
        let _retry = 0;
        if (res.headers) {
            const [limit, remaining, reset, retry, cf] = getHeaders(res, headers), _reset = ~~reset * 1000 + Date.now() + this.rest.options.offset;
            this.remaining = remaining ? ~~remaining : 1;
            this.limit = limit ? ~~limit : Infinity;
            this.reset = reset ? _reset : Date.now();
            if (retry) {
                _retry = ~~reset * (cf ? 1000 : 1 + this.rest.options.offset);
            }
            if (res.headers.get("X-RateLimit-Global")) {
                this.rest.globalTimeout = (0, _utils).sleep(_retry).then(()=>{
                    this.api.globalTimeout = null;
                });
            }
        }
        if (res.ok) {
            return RequestHandler.parseResponse(res);
        }
        if (res.status === 429) {
            this.rest.client.emit(_utils.ClientEvent.LIMITED, `Hit a 429 on route: ${this.id}, Retrying After: ${_retry}ms`);
            await (0, _utils).sleep(_retry);
            return this._make(url, request, tries++);
        }
        if (res.status >= 500 && res.status < 600) {
            if (tries !== this.rest.options.retries) {
                return this._make(url, request, tries++);
            }
            throw new _errors.DiscordHTTPError(res.statusText, res.constructor.name, res.status, request.method, url);
        }
        if (res.status >= 400 && res.status < 500) {
            const data = await RequestHandler.parseResponse(res);
            throw new _errors.DiscordAPIError(data.message, data.code, res.status, request.method, url);
        }
        return null;
    }
    /**
     * @param {Rest} rest The REST Manager.
     * @param {string} id The ID of this request handler.
     */ constructor(rest, id){
        /**
     * Used for sequential requests.
     * @type {AsyncQueue}
     */ _queue.set(this, {
            writable: true,
            value: new _utils.AsyncQueue()
        });
        /**
         * The REST Manager.
         * @type {Rest}
         */ this.rest = rest;
        /**
         * The ID of this request handler.
         * @type {string}
         */ this.id = id;
        /**
         * Timestamp in which the rate-limit will reset.
         * @type {number}
         */ this.reset = -1;
        /**
         * The remaining requests that can be made.
         * @type {number}
         */ this.remaining = 1;
        /**
         * The total number of requests that can be made.
         * @type {number}
         */ this.limit = Infinity;
    }
}
exports.RequestHandler = RequestHandler;
var _queue = new WeakMap();
/**
 * Bulk fetch headers from a node-fetch response.
 * @param {Response} res The request response.
 * @param {string[]} headers The headers to fetch.
 * @return {string[]} The header values.
 */ function getHeaders(res, headers1) {
    return headers1.map((headerName)=>res.headers.get(headerName)
    );
}
