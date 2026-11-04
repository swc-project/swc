function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertThrows, createResolvable } from "./test_util.ts";
function defer(n) {
    return new Promise(function(resolve, _) {
        setTimeout(resolve, n);
    });
}
unitTest({
    ignore: Deno.build.os !== "windows"
}, function signalsNotImplemented() {
    assertThrows(function() {
        Deno.signal(1);
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.alarm(); // for SIGALRM
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.child(); // for SIGCHLD
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.hungup(); // for SIGHUP
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.interrupt(); // for SIGINT
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.io(); // for SIGIO
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.pipe(); // for SIGPIPE
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.quit(); // for SIGQUIT
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.terminate(); // for SIGTERM
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.userDefined1(); // for SIGUSR1
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.userDefined2(); // for SIGURS2
    }, Error, "not implemented");
    assertThrows(function() {
        Deno.signals.windowChange(); // for SIGWINCH
    }, Error, "not implemented");
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        run: true,
        net: true
    }
}, function signalStreamTest() {
    return _async_to_generator(function() {
        var resolvable, t, c, sig, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, _, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    resolvable = createResolvable();
                    // This prevents the program from exiting.
                    t = setInterval(function() {}, 1000);
                    c = 0;
                    sig = Deno.signal(Deno.Signal.SIGUSR1);
                    setTimeout(function() {
                        return _async_to_generator(function() {
                            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _, err;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            defer(20)
                                        ];
                                    case 1:
                                        _state.sent();
                                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                        _state.label = 2;
                                    case 2:
                                        _state.trys.push([
                                            2,
                                            7,
                                            8,
                                            9
                                        ]);
                                        _iterator = Array(3)[Symbol.iterator]();
                                        _state.label = 3;
                                    case 3:
                                        if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                            3,
                                            6
                                        ];
                                        _ = _step.value;
                                        // Sends SIGUSR1 3 times.
                                        Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
                                        return [
                                            4,
                                            defer(20)
                                        ];
                                    case 4:
                                        _state.sent();
                                        _state.label = 5;
                                    case 5:
                                        _iteratorNormalCompletion = true;
                                        return [
                                            3,
                                            3
                                        ];
                                    case 6:
                                        return [
                                            3,
                                            9
                                        ];
                                    case 7:
                                        err = _state.sent();
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                        return [
                                            3,
                                            9
                                        ];
                                    case 8:
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                                _iterator.return();
                                            }
                                        } finally{
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                        return [
                                            7
                                        ];
                                    case 9:
                                        sig.dispose();
                                        resolvable.resolve();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator(sig);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        5
                    ];
                    _value = _step.value;
                    _ = _value;
                    c += 1;
                    _state.label = 4;
                case 4:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        12
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        12
                    ];
                case 7:
                    _state.trys.push([
                        7,
                        ,
                        10,
                        11
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    return [
                        3,
                        11
                    ];
                case 10:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 11:
                    return [
                        7
                    ];
                case 12:
                    assertEquals(c, 3);
                    clearInterval(t);
                    return [
                        4,
                        resolvable
                    ];
                case 13:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        run: true
    }
}, function signalPromiseTest() {
    return _async_to_generator(function() {
        var resolvable, t, sig;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    resolvable = createResolvable();
                    // This prevents the program from exiting.
                    t = setInterval(function() {}, 1000);
                    sig = Deno.signal(Deno.Signal.SIGUSR1);
                    setTimeout(function() {
                        Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
                        resolvable.resolve();
                    }, 20);
                    return [
                        4,
                        sig
                    ];
                case 1:
                    _state.sent();
                    sig.dispose();
                    clearInterval(t);
                    return [
                        4,
                        resolvable
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        run: true
    }
}, function signalShorthandsTest() {
    var s;
    s = Deno.signals.alarm(); // for SIGALRM
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.child(); // for SIGCHLD
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.hungup(); // for SIGHUP
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.interrupt(); // for SIGINT
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.io(); // for SIGIO
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.pipe(); // for SIGPIPE
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.quit(); // for SIGQUIT
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.terminate(); // for SIGTERM
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.userDefined1(); // for SIGUSR1
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.userDefined2(); // for SIGURS2
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
    s = Deno.signals.windowChange(); // for SIGWINCH
    assert(_instanceof(s, Deno.SignalStream));
    s.dispose();
});
