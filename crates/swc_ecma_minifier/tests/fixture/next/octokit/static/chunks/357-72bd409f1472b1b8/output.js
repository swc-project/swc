export default function(module, __unused_webpack_exports, __webpack_require__) {
    var factory;
    factory = function() {
        'use strict';
        var commonjsGlobal = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : void 0 !== __webpack_require__.g ? __webpack_require__.g : 'undefined' != typeof self ? self : {}, parser = {
            load: function(received, defaults, onto = {}) {
                var k, ref, v;
                for(k in defaults)v = defaults[k], onto[k] = null != (ref = received[k]) ? ref : v;
                return onto;
            },
            overwrite: function(received, defaults, onto = {}) {
                var k, v;
                for(k in received)v = received[k], void 0 !== defaults[k] && (onto[k] = v);
                return onto;
            }
        };
        DLList = class {
            constructor(incr, decr){
                this.incr = incr, this.decr = decr, this._first = null, this._last = null, this.length = 0;
            }
            push(value) {
                var node;
                this.length++, "function" == typeof this.incr && this.incr(), node = {
                    value,
                    prev: this._last,
                    next: null
                }, null != this._last ? (this._last.next = node, this._last = node) : this._first = this._last = node;
            }
            shift() {
                var value;
                return null == this._first ? void 0 : (this.length--, "function" == typeof this.decr && this.decr(), value = this._first.value, null != (this._first = this._first.next) ? this._first.prev = null : this._last = null, value);
            }
            first() {
                if (null != this._first) return this._first.value;
            }
            getArray() {
                var node, ref, results;
                for(node = this._first, results = []; null != node;)results.push((ref = node, node = node.next, ref.value));
                return results;
            }
            forEachShift(cb) {
                var node;
                for(node = this.shift(); null != node;)cb(node), node = this.shift();
            }
            debug() {
                var node, ref, ref1, ref2, results;
                for(node = this._first, results = []; null != node;)results.push((ref = node, node = node.next, {
                    value: ref.value,
                    prev: null != (ref1 = ref.prev) ? ref1.value : void 0,
                    next: null != (ref2 = ref.next) ? ref2.value : void 0
                }));
                return results;
            }
        }, Events = class {
            constructor(instance){
                if (this.instance = instance, this._events = {}, null != this.instance.on || null != this.instance.once || null != this.instance.removeAllListeners) throw Error("An Emitter already exists for this object");
                this.instance.on = (name, cb)=>this._addListener(name, "many", cb), this.instance.once = (name, cb)=>this._addListener(name, "once", cb), this.instance.removeAllListeners = (name = null)=>null != name ? delete this._events[name] : this._events = {};
            }
            _addListener(name, status, cb) {
                var base;
                return null == (base = this._events)[name] && (base[name] = []), this._events[name].push({
                    cb,
                    status
                }), this.instance;
            }
            listenerCount(name) {
                return null != this._events[name] ? this._events[name].length : 0;
            }
            async trigger(name, ...args) {
                var promises;
                try {
                    if ("debug" !== name && this.trigger("debug", `Event triggered: ${name}`, args), null == this._events[name]) return;
                    return this._events[name] = this._events[name].filter(function(listener) {
                        return "none" !== listener.status;
                    }), promises = this._events[name].map(async (listener)=>{
                        var returned;
                        if ("none" !== listener.status) {
                            "once" === listener.status && (listener.status = "none");
                            try {
                                if (returned = "function" == typeof listener.cb ? listener.cb(...args) : void 0, "function" == typeof (null != returned ? returned.then : void 0)) return await returned;
                                return returned;
                            } catch (error) {
                                return this.trigger("error", error), null;
                            }
                        }
                    }), (await Promise.all(promises)).find(function(x) {
                        return null != x;
                    });
                } catch (error) {
                    return this.trigger("error", error), null;
                }
            }
        }, Queues = class {
            constructor(num_priorities){
                this.Events = new Events(this), this._length = 0, this._lists = (function() {
                    var j, results;
                    for(results = [], j = 1; 1 <= num_priorities ? j <= num_priorities : j >= num_priorities; 1 <= num_priorities ? ++j : --j)results.push(new DLList(()=>this.incr(), ()=>this.decr()));
                    return results;
                }).call(this);
            }
            incr() {
                if (0 == this._length++) return this.Events.trigger("leftzero");
            }
            decr() {
                if (0 == --this._length) return this.Events.trigger("zero");
            }
            push(job) {
                return this._lists[job.options.priority].push(job);
            }
            queued(priority) {
                return null != priority ? this._lists[priority].length : this._length;
            }
            shiftAll(fn) {
                return this._lists.forEach(function(list) {
                    return list.forEachShift(fn);
                });
            }
            getFirst(arr = this._lists) {
                var j, len, list;
                for(j = 0, len = arr.length; j < len; j++)if ((list = arr[j]).length > 0) return list;
                return [];
            }
            shiftLastFrom(priority) {
                return this.getFirst(this._lists.slice(priority).reverse()).shift();
            }
        }, BottleneckError = class extends Error {
        }, Job = class {
            constructor(task, args, options, jobDefaults, rejectOnDrop, Events, _states, Promise1){
                this.task = task, this.args = args, this.rejectOnDrop = rejectOnDrop, this.Events = Events, this._states = _states, this.Promise = Promise1, this.options = parser.load(options, jobDefaults), this.options.priority = this._sanitizePriority(this.options.priority), this.options.id === jobDefaults.id && (this.options.id = `${this.options.id}-${this._randomIndex()}`), this.promise = new this.Promise((_resolve, _reject)=>{
                    this._resolve = _resolve, this._reject = _reject;
                }), this.retryCount = 0;
            }
            _sanitizePriority(priority) {
                var sProperty;
                return (sProperty = ~~priority !== priority ? 5 : priority) < 0 ? 0 : sProperty > 9 ? 9 : sProperty;
            }
            _randomIndex() {
                return Math.random().toString(36).slice(2);
            }
            doDrop({ error, message = "This job has been dropped by Bottleneck" } = {}) {
                return !!this._states.remove(this.options.id) && (this.rejectOnDrop && this._reject(null != error ? error : new BottleneckError(message)), this.Events.trigger("dropped", {
                    args: this.args,
                    options: this.options,
                    task: this.task,
                    promise: this.promise
                }), !0);
            }
            _assertStatus(expected) {
                var status;
                if (!((status = this._states.jobStatus(this.options.id)) === expected || "DONE" === expected && null === status)) throw new BottleneckError(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
            }
            doReceive() {
                return this._states.start(this.options.id), this.Events.trigger("received", {
                    args: this.args,
                    options: this.options
                });
            }
            doQueue(reachedHWM, blocked) {
                return this._assertStatus("RECEIVED"), this._states.next(this.options.id), this.Events.trigger("queued", {
                    args: this.args,
                    options: this.options,
                    reachedHWM,
                    blocked
                });
            }
            doRun() {
                return 0 === this.retryCount ? (this._assertStatus("QUEUED"), this._states.next(this.options.id)) : this._assertStatus("EXECUTING"), this.Events.trigger("scheduled", {
                    args: this.args,
                    options: this.options
                });
            }
            async doExecute(chained, clearGlobalState, run, free) {
                var eventInfo, passed;
                0 === this.retryCount ? (this._assertStatus("RUNNING"), this._states.next(this.options.id)) : this._assertStatus("EXECUTING"), eventInfo = {
                    args: this.args,
                    options: this.options,
                    retryCount: this.retryCount
                }, this.Events.trigger("executing", eventInfo);
                try {
                    if (passed = await (null != chained ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args)), clearGlobalState()) return this.doDone(eventInfo), await free(this.options, eventInfo), this._assertStatus("DONE"), this._resolve(passed);
                } catch (error1) {
                    return this._onFailure(error1, eventInfo, clearGlobalState, run, free);
                }
            }
            doExpire(clearGlobalState, run, free) {
                var error, eventInfo;
                return this._states.jobStatus("RUNNING" === this.options.id) && this._states.next(this.options.id), this._assertStatus("EXECUTING"), eventInfo = {
                    args: this.args,
                    options: this.options,
                    retryCount: this.retryCount
                }, error = new BottleneckError(`This job timed out after ${this.options.expiration} ms.`), this._onFailure(error, eventInfo, clearGlobalState, run, free);
            }
            async _onFailure(error, eventInfo, clearGlobalState, run, free) {
                var retry, retryAfter;
                if (clearGlobalState()) return null != (retry = await this.Events.trigger("failed", error, eventInfo)) ? (retryAfter = ~~retry, this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo), this.retryCount++, run(retryAfter)) : (this.doDone(eventInfo), await free(this.options, eventInfo), this._assertStatus("DONE"), this._reject(error));
            }
            doDone(eventInfo) {
                return this._assertStatus("EXECUTING"), this._states.next(this.options.id), this.Events.trigger("done", eventInfo);
            }
        }, LocalDatastore = class {
            constructor(instance, storeOptions, storeInstanceOptions){
                this.instance = instance, this.storeOptions = storeOptions, this.clientId = this.instance._randomIndex(), parser.load(storeInstanceOptions, storeInstanceOptions, this), this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now(), this._running = 0, this._done = 0, this._unblockTime = 0, this.ready = this.Promise.resolve(), this.clients = {}, this._startHeartbeat();
            }
            _startHeartbeat() {
                var base;
                return null == this.heartbeat && (null != this.storeOptions.reservoirRefreshInterval && null != this.storeOptions.reservoirRefreshAmount || null != this.storeOptions.reservoirIncreaseInterval && null != this.storeOptions.reservoirIncreaseAmount) ? "function" == typeof (base = this.heartbeat = setInterval(()=>{
                    var amount, incr, maximum, now, reservoir;
                    if (now = Date.now(), null != this.storeOptions.reservoirRefreshInterval && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval && (this._lastReservoirRefresh = now, this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount, this.instance._drainAll(this.computeCapacity())), null != this.storeOptions.reservoirIncreaseInterval && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval && ({ reservoirIncreaseAmount: amount, reservoirIncreaseMaximum: maximum, reservoir } = this.storeOptions, this._lastReservoirIncrease = now, (incr = null != maximum ? Math.min(amount, maximum - reservoir) : amount) > 0)) return this.storeOptions.reservoir += incr, this.instance._drainAll(this.computeCapacity());
                }, this.heartbeatInterval)).unref ? base.unref() : void 0 : clearInterval(this.heartbeat);
            }
            async __publish__(message) {
                return await this.yieldLoop(), this.instance.Events.trigger("message", message.toString());
            }
            async __disconnect__(flush) {
                return await this.yieldLoop(), clearInterval(this.heartbeat), this.Promise.resolve();
            }
            yieldLoop(t = 0) {
                return new this.Promise(function(resolve, reject) {
                    return setTimeout(resolve, t);
                });
            }
            computePenalty() {
                var ref;
                return null != (ref = this.storeOptions.penalty) ? ref : 15 * this.storeOptions.minTime || 5000;
            }
            async __updateSettings__(options) {
                return await this.yieldLoop(), parser.overwrite(options, options, this.storeOptions), this._startHeartbeat(), this.instance._drainAll(this.computeCapacity()), !0;
            }
            async __running__() {
                return await this.yieldLoop(), this._running;
            }
            async __queued__() {
                return await this.yieldLoop(), this.instance.queued();
            }
            async __done__() {
                return await this.yieldLoop(), this._done;
            }
            async __groupCheck__(time) {
                return await this.yieldLoop(), this._nextRequest + this.timeout < time;
            }
            computeCapacity() {
                var maxConcurrent, reservoir;
                return ({ maxConcurrent, reservoir } = this.storeOptions, null != maxConcurrent && null != reservoir) ? Math.min(maxConcurrent - this._running, reservoir) : null != maxConcurrent ? maxConcurrent - this._running : null != reservoir ? reservoir : null;
            }
            conditionsCheck(weight) {
                var capacity;
                return null == (capacity = this.computeCapacity()) || weight <= capacity;
            }
            async __incrementReservoir__(incr) {
                var reservoir;
                return await this.yieldLoop(), reservoir = this.storeOptions.reservoir += incr, this.instance._drainAll(this.computeCapacity()), reservoir;
            }
            async __currentReservoir__() {
                return await this.yieldLoop(), this.storeOptions.reservoir;
            }
            isBlocked(now) {
                return this._unblockTime >= now;
            }
            check(weight, now) {
                return this.conditionsCheck(weight) && this._nextRequest - now <= 0;
            }
            async __check__(weight) {
                var now;
                return await this.yieldLoop(), now = Date.now(), this.check(weight, now);
            }
            async __register__(index, weight, expiration) {
                var now, wait;
                return (await this.yieldLoop(), now = Date.now(), this.conditionsCheck(weight)) ? (this._running += weight, null != this.storeOptions.reservoir && (this.storeOptions.reservoir -= weight), wait = Math.max(this._nextRequest - now, 0), this._nextRequest = now + wait + this.storeOptions.minTime, {
                    success: !0,
                    wait,
                    reservoir: this.storeOptions.reservoir
                }) : {
                    success: !1
                };
            }
            strategyIsBlock() {
                return 3 === this.storeOptions.strategy;
            }
            async __submit__(queueLength, weight) {
                var blocked, now, reachedHWM;
                if (await this.yieldLoop(), null != this.storeOptions.maxConcurrent && weight > this.storeOptions.maxConcurrent) throw new BottleneckError(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
                return now = Date.now(), reachedHWM = null != this.storeOptions.highWater && queueLength === this.storeOptions.highWater && !this.check(weight, now), (blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now))) && (this._unblockTime = now + this.computePenalty(), this._nextRequest = this._unblockTime + this.storeOptions.minTime, this.instance._dropAllQueued()), {
                    reachedHWM,
                    blocked,
                    strategy: this.storeOptions.strategy
                };
            }
            async __free__(index, weight) {
                return await this.yieldLoop(), this._running -= weight, this._done += weight, this.instance._drainAll(this.computeCapacity()), {
                    running: this._running
                };
            }
        }, States = class {
            constructor(status1){
                this.status = status1, this._jobs = {}, this.counts = this.status.map(function() {
                    return 0;
                });
            }
            next(id) {
                var current, next;
                return (next = (current = this._jobs[id]) + 1, null != current && next < this.status.length) ? (this.counts[current]--, this.counts[next]++, this._jobs[id]++) : null != current ? (this.counts[current]--, delete this._jobs[id]) : void 0;
            }
            start(id) {
                return this._jobs[id] = 0, this.counts[0]++;
            }
            remove(id) {
                var current;
                return null != (current = this._jobs[id]) && (this.counts[current]--, delete this._jobs[id]), null != current;
            }
            jobStatus(id) {
                var ref;
                return null != (ref = this.status[this._jobs[id]]) ? ref : null;
            }
            statusJobs(status) {
                var k, pos, ref, results;
                if (null == status) return Object.keys(this._jobs);
                if ((pos = this.status.indexOf(status)) < 0) throw new BottleneckError(`status must be one of ${this.status.join(', ')}`);
                for(k in ref = this._jobs, results = [], ref)ref[k] === pos && results.push(k);
                return results;
            }
            statusCounts() {
                return this.counts.reduce((acc, v, i)=>(acc[this.status[i]] = v, acc), {});
            }
        }, Sync = class {
            constructor(name, Promise1){
                this.schedule = this.schedule.bind(this), this.name = name, this.Promise = Promise1, this._running = 0, this._queue = new DLList();
            }
            isEmpty() {
                return 0 === this._queue.length;
            }
            async _tryToRun() {
                var args, cb, reject, resolve, returned, task;
                if (this._running < 1 && this._queue.length > 0) return this._running++, { task, args, resolve, reject } = this._queue.shift(), cb = await async function() {
                    try {
                        return returned = await task(...args), function() {
                            return resolve(returned);
                        };
                    } catch (error1) {
                        return function() {
                            return reject(error1);
                        };
                    }
                }(), this._running--, this._tryToRun(), cb();
            }
            schedule(task, ...args) {
                var promise, reject, resolve;
                return resolve = reject = null, promise = new this.Promise(function(_resolve, _reject) {
                    return resolve = _resolve, reject = _reject;
                }), this._queue.push({
                    task,
                    args,
                    resolve,
                    reject
                }), this._tryToRun(), promise;
            }
        };
        var version = "2.19.5", version$2 = /*#__PURE__*/ Object.freeze({
            version: version,
            default: {
                version: version
            }
        }), require$$2 = ()=>console.log('You must import the full version of Bottleneck in order to use this feature.'), require$$3 = ()=>console.log('You must import the full version of Bottleneck in order to use this feature.');
        Scripts$1 = ()=>console.log('You must import the full version of Bottleneck in order to use this feature.'), Group = (function() {
            class Group {
                constructor(limiterOptions = {}){
                    this.deleteKey = this.deleteKey.bind(this), this.limiterOptions = limiterOptions, parser.load(this.limiterOptions, this.defaults, this), this.Events = new Events(this), this.instances = {}, this.Bottleneck = Bottleneck_1, this._startAutoCleanup(), this.sharedConnection = null != this.connection, null == this.connection && ("redis" === this.limiterOptions.datastore ? this.connection = new require$$2(Object.assign({}, this.limiterOptions, {
                        Events: this.Events
                    })) : "ioredis" === this.limiterOptions.datastore && (this.connection = new require$$3(Object.assign({}, this.limiterOptions, {
                        Events: this.Events
                    }))));
                }
                key(key = "") {
                    var ref;
                    return null != (ref = this.instances[key]) ? ref : (()=>{
                        var limiter;
                        return limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
                            id: `${this.id}-${key}`,
                            timeout: this.timeout,
                            connection: this.connection
                        })), this.Events.trigger("created", limiter, key), limiter;
                    })();
                }
                async deleteKey(key = "") {
                    var deleted, instance;
                    return instance = this.instances[key], this.connection && (deleted = await this.connection.__runCommand__([
                        'del',
                        ...Scripts$1.allKeys(`${this.id}-${key}`)
                    ])), null != instance && (delete this.instances[key], await instance.disconnect()), null != instance || deleted > 0;
                }
                limiters() {
                    var k, ref, results, v;
                    for(k in ref = this.instances, results = [], ref)v = ref[k], results.push({
                        key: k,
                        limiter: v
                    });
                    return results;
                }
                keys() {
                    return Object.keys(this.instances);
                }
                async clusterKeys() {
                    var cursor, found, i, k, keys, len, next, start;
                    if (null == this.connection) return this.Promise.resolve(this.keys());
                    for(keys = [], cursor = null, start = `b_${this.id}-`.length; 0 !== cursor;)for(i = 0, [next, found] = await this.connection.__runCommand__([
                        "scan",
                        null != cursor ? cursor : 0,
                        "match",
                        `b_${this.id}-*_settings`,
                        "count",
                        10000
                    ]), cursor = ~~next, len = found.length; i < len; i++)k = found[i], keys.push(k.slice(start, -9));
                    return keys;
                }
                _startAutoCleanup() {
                    var base;
                    return clearInterval(this.interval), "function" == typeof (base = this.interval = setInterval(async ()=>{
                        var k, ref, results, time, v;
                        for(k in time = Date.now(), ref = this.instances, results = [], ref){
                            v = ref[k];
                            try {
                                await v._store.__groupCheck__(time) ? results.push(this.deleteKey(k)) : results.push(void 0);
                            } catch (error) {
                                results.push(v.Events.trigger("error", error));
                            }
                        }
                        return results;
                    }, this.timeout / 2)).unref ? base.unref() : void 0;
                }
                updateSettings(options = {}) {
                    if (parser.overwrite(options, this.defaults, this), parser.overwrite(options, options, this.limiterOptions), null != options.timeout) return this._startAutoCleanup();
                }
                disconnect(flush = !0) {
                    var ref;
                    if (!this.sharedConnection) return null != (ref = this.connection) ? ref.disconnect(flush) : void 0;
                }
            }
            return Group.prototype.defaults = {
                timeout: 300000,
                connection: null,
                Promise: Promise,
                id: "group-key"
            }, Group;
        }).call(commonjsGlobal), Batcher = (function() {
            class Batcher {
                constructor(options = {}){
                    this.options = options, parser.load(this.options, this.defaults, this), this.Events = new Events(this), this._arr = [], this._resetPromise(), this._lastFlush = Date.now();
                }
                _resetPromise() {
                    return this._promise = new this.Promise((res, rej)=>this._resolve = res);
                }
                _flush() {
                    return clearTimeout(this._timeout), this._lastFlush = Date.now(), this._resolve(), this.Events.trigger("batch", this._arr), this._arr = [], this._resetPromise();
                }
                add(data) {
                    var ret;
                    return this._arr.push(data), ret = this._promise, this._arr.length === this.maxSize ? this._flush() : null != this.maxTime && 1 === this._arr.length && (this._timeout = setTimeout(()=>this._flush(), this.maxTime)), ret;
                }
            }
            return Batcher.prototype.defaults = {
                maxTime: null,
                maxSize: null,
                Promise: Promise
            }, Batcher;
        }).call(commonjsGlobal);
        var DLList, Events, Queues, BottleneckError, Job, LocalDatastore, States, Sync, Group, Scripts$1, Batcher, RedisDatastore$1, require$$8 = version$2 && version$2.default || version$2, splice = [].splice;
        RedisDatastore$1 = ()=>console.log('You must import the full version of Bottleneck in order to use this feature.');
        var Bottleneck_1 = (function() {
            class Bottleneck {
                constructor(options = {}, ...invalid){
                    var storeOptions;
                    this._addToQueue = this._addToQueue.bind(this), this._validateOptions(options, invalid), parser.load(options, this.instanceDefaults, this), this._queues = new Queues(10), this._scheduled = {}, this._states = new States([
                        "RECEIVED",
                        "QUEUED",
                        "RUNNING",
                        "EXECUTING"
                    ].concat(this.trackDoneStatus ? [
                        "DONE"
                    ] : [])), this._limiter = null, this.Events = new Events(this), this._submitLock = new Sync("submit", this.Promise), this._registerLock = new Sync("register", this.Promise), storeOptions = parser.load(options, this.storeDefaults, {}), this._store = (function() {
                        if ("redis" === this.datastore || "ioredis" === this.datastore || null != this.connection) return new RedisDatastore$1(this, storeOptions, parser.load(options, this.redisStoreDefaults, {}));
                        if ("local" === this.datastore) return new LocalDatastore(this, storeOptions, parser.load(options, this.localStoreDefaults, {}));
                        throw new Bottleneck.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
                    }).call(this), this._queues.on("leftzero", ()=>{
                        var ref;
                        return null != (ref = this._store.heartbeat) && "function" == typeof ref.ref ? ref.ref() : void 0;
                    }), this._queues.on("zero", ()=>{
                        var ref;
                        return null != (ref = this._store.heartbeat) && "function" == typeof ref.unref ? ref.unref() : void 0;
                    });
                }
                _validateOptions(options, invalid) {
                    if (!(null != options && "object" == typeof options && 0 === invalid.length)) throw new Bottleneck.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
                }
                ready() {
                    return this._store.ready;
                }
                clients() {
                    return this._store.clients;
                }
                channel() {
                    return `b_${this.id}`;
                }
                channel_client() {
                    return `b_${this.id}_${this._store.clientId}`;
                }
                publish(message) {
                    return this._store.__publish__(message);
                }
                disconnect(flush = !0) {
                    return this._store.__disconnect__(flush);
                }
                chain(_limiter) {
                    return this._limiter = _limiter, this;
                }
                queued(priority) {
                    return this._queues.queued(priority);
                }
                clusterQueued() {
                    return this._store.__queued__();
                }
                empty() {
                    return 0 === this.queued() && this._submitLock.isEmpty();
                }
                running() {
                    return this._store.__running__();
                }
                done() {
                    return this._store.__done__();
                }
                jobStatus(id) {
                    return this._states.jobStatus(id);
                }
                jobs(status) {
                    return this._states.statusJobs(status);
                }
                counts() {
                    return this._states.statusCounts();
                }
                _randomIndex() {
                    return Math.random().toString(36).slice(2);
                }
                check(weight = 1) {
                    return this._store.__check__(weight);
                }
                _clearGlobalState(index) {
                    return null != this._scheduled[index] && (clearTimeout(this._scheduled[index].expiration), delete this._scheduled[index], !0);
                }
                async _free(index, job, options, eventInfo) {
                    var running;
                    try {
                        if ({ running } = await this._store.__free__(index, options.weight), this.Events.trigger("debug", `Freed ${options.id}`, eventInfo), 0 === running && this.empty()) return this.Events.trigger("idle");
                    } catch (error1) {
                        return this.Events.trigger("error", error1);
                    }
                }
                _run(index, job, wait) {
                    var clearGlobalState, free, run;
                    return job.doRun(), clearGlobalState = this._clearGlobalState.bind(this, index), run = this._run.bind(this, index, job), free = this._free.bind(this, index, job), this._scheduled[index] = {
                        timeout: setTimeout(()=>job.doExecute(this._limiter, clearGlobalState, run, free), wait),
                        expiration: null != job.options.expiration ? setTimeout(function() {
                            return job.doExpire(clearGlobalState, run, free);
                        }, wait + job.options.expiration) : void 0,
                        job: job
                    };
                }
                _drainOne(capacity) {
                    return this._registerLock.schedule(()=>{
                        var args, index, next, options, queue;
                        return 0 === this.queued() ? this.Promise.resolve(null) : (queue = this._queues.getFirst(), { options, args } = next = queue.first(), null != capacity && options.weight > capacity) ? this.Promise.resolve(null) : (this.Events.trigger("debug", `Draining ${options.id}`, {
                            args,
                            options
                        }), index = this._randomIndex(), this._store.__register__(index, options.weight, options.expiration).then(({ success, wait, reservoir })=>{
                            var empty;
                            return (this.Events.trigger("debug", `Drained ${options.id}`, {
                                success,
                                args,
                                options
                            }), success) ? (queue.shift(), (empty = this.empty()) && this.Events.trigger("empty"), 0 === reservoir && this.Events.trigger("depleted", empty), this._run(index, next, wait), this.Promise.resolve(options.weight)) : this.Promise.resolve(null);
                        }));
                    });
                }
                _drainAll(capacity, total = 0) {
                    return this._drainOne(capacity).then((drained)=>{
                        var newCapacity;
                        return null != drained ? (newCapacity = null != capacity ? capacity - drained : capacity, this._drainAll(newCapacity, total + drained)) : this.Promise.resolve(total);
                    }).catch((e)=>this.Events.trigger("error", e));
                }
                _dropAllQueued(message) {
                    return this._queues.shiftAll(function(job) {
                        return job.doDrop({
                            message
                        });
                    });
                }
                stop(options = {}) {
                    var done, waitForExecuting;
                    return options = parser.load(options, this.stopDefaults), waitForExecuting = (at)=>{
                        var finished;
                        return finished = ()=>{
                            var counts;
                            return (counts = this._states.counts)[0] + counts[1] + counts[2] + counts[3] === at;
                        }, new this.Promise((resolve, reject)=>finished() ? resolve() : this.on("done", ()=>{
                                if (finished()) return this.removeAllListeners("done"), resolve();
                            }));
                    }, done = options.dropWaitingJobs ? (this._run = function(index, next) {
                        return next.doDrop({
                            message: options.dropErrorMessage
                        });
                    }, this._drainOne = ()=>this.Promise.resolve(null), this._registerLock.schedule(()=>this._submitLock.schedule(()=>{
                            var k, ref, v;
                            for(k in ref = this._scheduled)v = ref[k], "RUNNING" === this.jobStatus(v.job.options.id) && (clearTimeout(v.timeout), clearTimeout(v.expiration), v.job.doDrop({
                                message: options.dropErrorMessage
                            }));
                            return this._dropAllQueued(options.dropErrorMessage), waitForExecuting(0);
                        }))) : this.schedule({
                        priority: 9,
                        weight: 0
                    }, ()=>waitForExecuting(1)), this._receive = function(job) {
                        return job._reject(new Bottleneck.prototype.BottleneckError(options.enqueueErrorMessage));
                    }, this.stop = ()=>this.Promise.reject(new Bottleneck.prototype.BottleneckError("stop() has already been called")), done;
                }
                async _addToQueue(job) {
                    var args, blocked, options, reachedHWM, shifted, strategy;
                    ({ args, options } = job);
                    try {
                        ({ reachedHWM, blocked, strategy } = await this._store.__submit__(this.queued(), options.weight));
                    } catch (error1) {
                        return this.Events.trigger("debug", `Could not queue ${options.id}`, {
                            args,
                            options,
                            error: error1
                        }), job.doDrop({
                            error: error1
                        }), !1;
                    }
                    return blocked ? (job.doDrop(), !0) : (reachedHWM && (null != (shifted = strategy === Bottleneck.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck.prototype.strategy.OVERFLOW ? job : void 0) && shifted.doDrop(), null == shifted || strategy === Bottleneck.prototype.strategy.OVERFLOW) ? null == shifted && job.doDrop() : (job.doQueue(reachedHWM, blocked), this._queues.push(job), await this._drainAll()), reachedHWM);
                }
                _receive(job) {
                    return null != this._states.jobStatus(job.options.id) ? (job._reject(new Bottleneck.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`)), !1) : (job.doReceive(), this._submitLock.schedule(this._addToQueue, job));
                }
                submit(...args) {
                    var cb, fn, job, options, ref, ref1;
                    return "function" == typeof args[0] ? (ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1), options = parser.load({}, this.jobDefaults)) : (ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1), options = parser.load(options, this.jobDefaults)), (job = new Job((...args)=>new this.Promise(function(resolve, reject) {
                            return fn(...args, function(...args) {
                                return (null != args[0] ? reject : resolve)(args);
                            });
                        }), args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise)).promise.then(function(args) {
                        return "function" == typeof cb ? cb(...args) : void 0;
                    }).catch(function(args) {
                        return Array.isArray(args) ? "function" == typeof cb ? cb(...args) : void 0 : "function" == typeof cb ? cb(args) : void 0;
                    }), this._receive(job);
                }
                schedule(...args) {
                    var job, options, task;
                    return "function" == typeof args[0] ? ([task, ...args] = args, options = {}) : [options, task, ...args] = args, job = new Job(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise), this._receive(job), job.promise;
                }
                wrap(fn) {
                    var schedule, wrapped;
                    return schedule = this.schedule.bind(this), (wrapped = function(...args) {
                        return schedule(fn.bind(this), ...args);
                    }).withOptions = function(options, ...args) {
                        return schedule(options, fn, ...args);
                    }, wrapped;
                }
                async updateSettings(options = {}) {
                    return await this._store.__updateSettings__(parser.overwrite(options, this.storeDefaults)), parser.overwrite(options, this.instanceDefaults, this), this;
                }
                currentReservoir() {
                    return this._store.__currentReservoir__();
                }
                incrementReservoir(incr = 0) {
                    return this._store.__incrementReservoir__(incr);
                }
            }
            return Bottleneck.default = Bottleneck, Bottleneck.Events = Events, Bottleneck.version = Bottleneck.prototype.version = require$$8.version, Bottleneck.strategy = Bottleneck.prototype.strategy = {
                LEAK: 1,
                OVERFLOW: 2,
                OVERFLOW_PRIORITY: 4,
                BLOCK: 3
            }, Bottleneck.BottleneckError = Bottleneck.prototype.BottleneckError = BottleneckError, Bottleneck.Group = Bottleneck.prototype.Group = Group, Bottleneck.RedisConnection = Bottleneck.prototype.RedisConnection = require$$2, Bottleneck.IORedisConnection = Bottleneck.prototype.IORedisConnection = require$$3, Bottleneck.Batcher = Bottleneck.prototype.Batcher = Batcher, Bottleneck.prototype.jobDefaults = {
                priority: 5,
                weight: 1,
                expiration: null,
                id: "<no-id>"
            }, Bottleneck.prototype.storeDefaults = {
                maxConcurrent: null,
                minTime: 0,
                highWater: null,
                strategy: Bottleneck.prototype.strategy.LEAK,
                penalty: null,
                reservoir: null,
                reservoirRefreshInterval: null,
                reservoirRefreshAmount: null,
                reservoirIncreaseInterval: null,
                reservoirIncreaseAmount: null,
                reservoirIncreaseMaximum: null
            }, Bottleneck.prototype.localStoreDefaults = {
                Promise: Promise,
                timeout: null,
                heartbeatInterval: 250
            }, Bottleneck.prototype.redisStoreDefaults = {
                Promise: Promise,
                timeout: null,
                heartbeatInterval: 5000,
                clientTimeout: 10000,
                Redis: null,
                clientOptions: {},
                clusterNodes: null,
                clearDatastore: !1,
                connection: null
            }, Bottleneck.prototype.instanceDefaults = {
                datastore: "local",
                connection: null,
                id: "<no-id>",
                rejectOnDrop: !0,
                trackDoneStatus: !1,
                Promise: Promise
            }, Bottleneck.prototype.stopDefaults = {
                enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
                dropWaitingJobs: !0,
                dropErrorMessage: "This limiter has been stopped."
            }, Bottleneck;
        }).call(commonjsGlobal);
        return Bottleneck_1;
    }, module.exports = factory();
/***/ }
