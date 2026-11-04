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
function _ts_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) {
        return m.call(o);
    }
    if (o && typeof o.length === "number") {
        return {
            next: function() {
                if (o && i >= o.length) {
                    o = void 0;
                }
                return {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, createResolvable, assert, assertEquals, assertNotEquals } from "./test_util.ts";
function deferred() {
    var resolve;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var reject = undefined;
    var promise = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
    });
    return {
        promise: promise,
        resolve: resolve,
        reject: reject
    };
}
function waitForMs(ms) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms);
    });
}
unitTest(function timeoutSuccess() {
    return _async_to_generator(function() {
        var _deferred, promise, resolve, count;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    count = 0;
                    setTimeout(function() {
                        count++;
                        resolve();
                    }, 500);
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    // count should increment
                    assertEquals(count, 1);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timeoutArgs() {
    return _async_to_generator(function() {
        var _deferred, promise, resolve, arg;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    arg = 1;
                    setTimeout(function(a, b, c) {
                        assertEquals(a, arg);
                        assertEquals(b, arg.toString());
                        assertEquals(c, [
                            arg
                        ]);
                        resolve();
                    }, 10, arg, arg.toString(), [
                        arg
                    ]);
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timeoutCancelSuccess() {
    return _async_to_generator(function() {
        var count, id;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    count = 0;
                    id = setTimeout(function() {
                        count++;
                    }, 1);
                    // Cancelled, count should not increment
                    clearTimeout(id);
                    return [
                        4,
                        waitForMs(600)
                    ];
                case 1:
                    _state.sent();
                    assertEquals(count, 0);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timeoutCancelMultiple() {
    return _async_to_generator(function() {
        var t1, t2, t3, t4, t5, t6;
        function uncalled() {
            throw new Error("This function should not be called.");
        }
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // Set timers and cancel them in the same order.
                    t1 = setTimeout(uncalled, 10);
                    t2 = setTimeout(uncalled, 10);
                    t3 = setTimeout(uncalled, 10);
                    clearTimeout(t1);
                    clearTimeout(t2);
                    clearTimeout(t3);
                    // Set timers and cancel them in reverse order.
                    t4 = setTimeout(uncalled, 20);
                    t5 = setTimeout(uncalled, 20);
                    t6 = setTimeout(uncalled, 20);
                    clearTimeout(t6);
                    clearTimeout(t5);
                    clearTimeout(t4);
                    // Sleep until we're certain that the cancelled timers aren't gonna fire.
                    return [
                        4,
                        waitForMs(50)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timeoutCancelInvalidSilentFail() {
    return _async_to_generator(function() {
        var _deferred, promise, resolve, count, id;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // Expect no panic
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    count = 0;
                    id = setTimeout(function() {
                        count++;
                        // Should have no effect
                        clearTimeout(id);
                        resolve();
                    }, 500);
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    assertEquals(count, 1);
                    // Should silently fail (no panic)
                    clearTimeout(2147483647);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function intervalSuccess() {
    return _async_to_generator(function() {
        var _deferred, promise, resolve, count, id;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    count = 0;
                    id = setInterval(function() {
                        count++;
                        clearInterval(id);
                        resolve();
                    }, 100);
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    // Clear interval
                    clearInterval(id);
                    // count should increment twice
                    assertEquals(count, 1);
                    // Similar false async leaking alarm.
                    // Force next round of polling.
                    return [
                        4,
                        waitForMs(0)
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
unitTest(function intervalCancelSuccess() {
    return _async_to_generator(function() {
        var count, id;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    count = 0;
                    id = setInterval(function() {
                        count++;
                    }, 1);
                    clearInterval(id);
                    return [
                        4,
                        waitForMs(500)
                    ];
                case 1:
                    _state.sent();
                    assertEquals(count, 0);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function intervalOrdering() {
    return _async_to_generator(function() {
        var timers, timeouts, i;
        function onTimeout() {
            ++timeouts;
            for(var i = 1; i < timers.length; i++){
                clearTimeout(timers[i]);
            }
        }
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    timers = [];
                    timeouts = 0;
                    for(i = 0; i < 10; i++){
                        timers[i] = setTimeout(onTimeout, 1);
                    }
                    return [
                        4,
                        waitForMs(500)
                    ];
                case 1:
                    _state.sent();
                    assertEquals(timeouts, 1);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function intervalCancelInvalidSilentFail() {
    // Should silently fail (no panic)
    clearInterval(2147483647);
});
unitTest(function fireCallbackImmediatelyWhenDelayOverMaxValue() {
    return _async_to_generator(function() {
        var count;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    count = 0;
                    setTimeout(function() {
                        count++;
                    }, Math.pow(2, 31));
                    return [
                        4,
                        waitForMs(1)
                    ];
                case 1:
                    _state.sent();
                    assertEquals(count, 1);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timeoutCallbackThis() {
    return _async_to_generator(function() {
        var _deferred, promise, resolve, obj;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    obj = {
                        foo: function foo() {
                            assertEquals(this, window);
                            resolve();
                        }
                    };
                    setTimeout(obj.foo, 1);
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timeoutBindThis() {
    return _async_to_generator(function() {
        var thisCheckPassed, thisCheckFailed, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, thisArg, hasThrown;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    thisCheckPassed = [
                        null,
                        undefined,
                        window,
                        globalThis
                    ];
                    thisCheckFailed = [
                        0,
                        "",
                        true,
                        false,
                        {},
                        [],
                        "foo",
                        function() {},
                        Object.prototype
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var thisArg, resolvable, hasThrown;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    thisArg = _step.value;
                                    resolvable = createResolvable();
                                    hasThrown = 0;
                                    try {
                                        setTimeout.call(thisArg, function() {
                                            return resolvable.resolve();
                                        }, 1);
                                        hasThrown = 1;
                                    } catch (err) {
                                        if (_instanceof(err, TypeError)) {
                                            hasThrown = 2;
                                        } else {
                                            hasThrown = 3;
                                        }
                                    }
                                    return [
                                        4,
                                        resolvable
                                    ];
                                case 1:
                                    _state.sent();
                                    assertEquals(hasThrown, 1);
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = thisCheckPassed[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        8
                    ];
                case 7:
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
                case 8:
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(_iterator1 = thisCheckFailed[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            thisArg = _step1.value;
                            hasThrown = 0;
                            try {
                                setTimeout.call(thisArg, function() {}, 1);
                                hasThrown = 1;
                            } catch (err) {
                                if (_instanceof(err, TypeError)) {
                                    hasThrown = 2;
                                } else {
                                    hasThrown = 3;
                                }
                            }
                            assertEquals(hasThrown, 2);
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function clearTimeoutShouldConvertToNumber() {
    var called = false;
    var obj = {
        valueOf: function valueOf() {
            called = true;
            return 1;
        }
    };
    clearTimeout(obj);
    assert(called);
});
unitTest(function setTimeoutShouldThrowWithBigint() {
    var hasThrown = 0;
    try {
        setTimeout(function() {}, 1n);
        hasThrown = 1;
    } catch (err) {
        if (_instanceof(err, TypeError)) {
            hasThrown = 2;
        } else {
            hasThrown = 3;
        }
    }
    assertEquals(hasThrown, 2);
});
unitTest(function clearTimeoutShouldThrowWithBigint() {
    var hasThrown = 0;
    try {
        clearTimeout(1n);
        hasThrown = 1;
    } catch (err) {
        if (_instanceof(err, TypeError)) {
            hasThrown = 2;
        } else {
            hasThrown = 3;
        }
    }
    assertEquals(hasThrown, 2);
});
unitTest(function testFunctionName() {
    assertEquals(clearTimeout.name, "clearTimeout");
    assertEquals(clearInterval.name, "clearInterval");
});
unitTest(function testFunctionParamsLength() {
    assertEquals(setTimeout.length, 1);
    assertEquals(setInterval.length, 1);
    assertEquals(clearTimeout.length, 0);
    assertEquals(clearInterval.length, 0);
});
unitTest(function clearTimeoutAndClearIntervalNotBeEquals() {
    assertNotEquals(clearTimeout, clearInterval);
});
unitTest(function timerMaxCpuBug() {
    return _async_to_generator(function() {
        var opsDispatched, opsDispatched_;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // There was a bug where clearing a timeout would cause Deno to use 100% CPU.
                    clearTimeout(setTimeout(function() {}, 1000));
                    // We can check this by counting how many ops have triggered in the interim.
                    // Certainly less than 10 ops should have been dispatched in next 100 ms.
                    opsDispatched = Deno.metrics().opsDispatched;
                    return [
                        4,
                        waitForMs(100)
                    ];
                case 1:
                    _state.sent();
                    opsDispatched_ = Deno.metrics().opsDispatched;
                    assert(opsDispatched_ - opsDispatched < 10);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timerBasicMicrotaskOrdering() {
    return _async_to_generator(function() {
        var s, count, _deferred, promise, resolve;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    s = "";
                    count = 0;
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    setTimeout(function() {
                        Promise.resolve().then(function() {
                            count++;
                            s += "de";
                            if (count === 2) {
                                resolve();
                            }
                        });
                    });
                    setTimeout(function() {
                        count++;
                        s += "no";
                        if (count === 2) {
                            resolve();
                        }
                    });
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    assertEquals(s, "deno");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function timerNestedMicrotaskOrdering() {
    return _async_to_generator(function() {
        var s, _deferred, promise, resolve;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    s = "";
                    _deferred = deferred(), promise = _deferred.promise, resolve = _deferred.resolve;
                    s += "0";
                    setTimeout(function() {
                        s += "4";
                        setTimeout(function() {
                            return s += "A";
                        });
                        Promise.resolve().then(function() {
                            setTimeout(function() {
                                s += "B";
                                resolve();
                            });
                        }).then(function() {
                            s += "5";
                        });
                    });
                    setTimeout(function() {
                        return s += "6";
                    });
                    Promise.resolve().then(function() {
                        return s += "2";
                    });
                    Promise.resolve().then(function() {
                        return setTimeout(function() {
                            s += "7";
                            Promise.resolve().then(function() {
                                return s += "8";
                            }).then(function() {
                                s += "9";
                            });
                        });
                    });
                    Promise.resolve().then(function() {
                        return Promise.resolve().then(function() {
                            return s += "3";
                        });
                    });
                    s += "1";
                    return [
                        4,
                        promise
                    ];
                case 1:
                    _state.sent();
                    assertEquals(s, "0123456789AB");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function testQueueMicrotask() {
    assertEquals(typeof queueMicrotask === "undefined" ? "undefined" : _type_of(queueMicrotask), "function");
});
