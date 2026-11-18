function _assert_this_initialized(self) {
    if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
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
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) _construct = Reflect.construct;
    else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) return call;
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertThrows } from "./test_util.ts";
unitTest(function writableStreamDesiredSizeOnReleasedWriter() {
    var ws = new WritableStream();
    var writer = ws.getWriter();
    writer.releaseLock();
    assertThrows(function() {
        writer.desiredSize;
    }, TypeError);
});
unitTest(function writableStreamDesiredSizeInitialValue() {
    var ws = new WritableStream();
    var writer = ws.getWriter();
    assertEquals(writer.desiredSize, 1);
});
unitTest(function writableStreamDesiredSizeClosed() {
    return _async_to_generator(function() {
        var ws, writer;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ws = new WritableStream();
                    writer = ws.getWriter();
                    return [
                        4,
                        writer.close()
                    ];
                case 1:
                    _state.sent();
                    assertEquals(writer.desiredSize, 0);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function writableStreamStartThrowsDesiredSizeNull() {
    var ws = new WritableStream({
        start: function start(c) {
            c.error();
        }
    });
    var writer = ws.getWriter();
    assertEquals(writer.desiredSize, null, "desiredSize should be null");
});
unitTest(function getWriterOnClosingStream() {
    var ws = new WritableStream({});
    var writer = ws.getWriter();
    writer.close();
    writer.releaseLock();
    ws.getWriter();
});
unitTest(function getWriterOnClosedStream() {
    return _async_to_generator(function() {
        var ws, writer;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ws = new WritableStream({});
                    writer = ws.getWriter();
                    return [
                        4,
                        writer.close()
                    ];
                case 1:
                    _state.sent();
                    writer.releaseLock();
                    ws.getWriter();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function getWriterOnAbortedStream() {
    var ws = new WritableStream({});
    var writer = ws.getWriter();
    writer.abort();
    writer.releaseLock();
    ws.getWriter();
});
unitTest(function getWriterOnErroredStream() {
    var ws = new WritableStream({
        start: function start(c) {
            c.error();
        }
    });
    var writer = ws.getWriter();
    return writer.closed.then(function(v) {
        throw new Error("writer.closed fulfilled unexpectedly with: ".concat(v));
    }, function() {
        writer.releaseLock();
        ws.getWriter();
    });
});
unitTest(function closedAndReadyOnReleasedWriter() {
    var ws = new WritableStream({});
    var writer = ws.getWriter();
    writer.releaseLock();
    return writer.closed.then(function(v) {
        throw new Error("writer.closed fulfilled unexpectedly with: " + v);
    }, function(closedRejection) {
        assertEquals(closedRejection.name, "TypeError", "closed promise should reject with a TypeError");
        return writer.ready.then(function(v) {
            throw new Error("writer.ready fulfilled unexpectedly with: " + v);
        }, function(readyRejection) {
            return assertEquals(readyRejection, closedRejection, "ready promise should reject with the same error");
        });
    });
});
unitTest(function sinkMethodsCalledAsMethods() {
    var thisObject = null;
    // Calls to Sink methods after the first are implicitly ignored. Only the
    // first value that is passed to the resolver is used.
    var Sink = /*#__PURE__*/ function() {
        "use strict";
        function Sink() {
            _class_call_check(this, Sink);
        }
        _create_class(Sink, [
            {
                key: "start",
                value: function start() {
                    assertEquals(this, thisObject, "start should be called as a method");
                }
            },
            {
                key: "write",
                value: function write() {
                    assertEquals(this, thisObject, "write should be called as a method");
                }
            },
            {
                key: "close",
                value: function close() {
                    assertEquals(this, thisObject, "close should be called as a method");
                }
            },
            {
                key: "abort",
                value: function abort() {
                    assertEquals(this, thisObject, "abort should be called as a method");
                }
            }
        ]);
        return Sink;
    }();
    var theSink = new Sink();
    thisObject = theSink;
    var ws = new WritableStream(theSink);
    var writer = ws.getWriter();
    writer.write("a");
    var closePromise = writer.close();
    var ws2 = new WritableStream(theSink);
    var writer2 = ws2.getWriter();
    var abortPromise = writer2.abort();
    return Promise.all([
        closePromise,
        abortPromise
    ]).then(undefined);
});
unitTest(function sizeShouldNotBeCalledAsMethod() {
    var strategy = {
        size: function size() {
            if (this !== undefined) {
                throw new Error("size called as a method");
            }
            return 1;
        }
    };
    var ws = new WritableStream({}, strategy);
    var writer = ws.getWriter();
    return writer.write("a");
});
unitTest(function redundantReleaseLockIsNoOp() {
    var ws = new WritableStream();
    var writer1 = ws.getWriter();
    assertEquals(undefined, writer1.releaseLock(), "releaseLock() should return undefined");
    var writer2 = ws.getWriter();
    assertEquals(undefined, writer1.releaseLock(), "no-op releaseLock() should return undefined");
    // Calling releaseLock() on writer1 should not interfere with writer2. If it did, then the ready promise would be
    // rejected.
    return writer2.ready;
});
unitTest(function readyPromiseShouldFireBeforeReleaseLock() {
    var events = [];
    var ws = new WritableStream();
    var writer = ws.getWriter();
    return writer.ready.then(function() {
        // Force the ready promise back to a pending state.
        var writerPromise = writer.write("dummy");
        var readyPromise = writer.ready.catch(function() {
            return events.push("ready");
        });
        var closedPromise = writer.closed.catch(function() {
            return events.push("closed");
        });
        writer.releaseLock();
        return Promise.all([
            readyPromise,
            closedPromise
        ]).then(function() {
            assertEquals(events, [
                "ready",
                "closed"
            ], "ready promise should fire before closed promise");
            // Stop the writer promise hanging around after the test has finished.
            return Promise.all([
                writerPromise,
                ws.abort()
            ]).then(undefined);
        });
    });
});
unitTest(function subclassingWritableStream() {
    var Subclass = /*#__PURE__*/ function(WritableStream1) {
        "use strict";
        _inherits(Subclass, WritableStream1);
        function Subclass() {
            _class_call_check(this, Subclass);
            return _call_super(this, Subclass, arguments);
        }
        _create_class(Subclass, [
            {
                key: "extraFunction",
                value: function extraFunction() {
                    return true;
                }
            }
        ]);
        return Subclass;
    }(_wrap_native_super(WritableStream));
    assert(Object.getPrototypeOf(Subclass.prototype) === WritableStream.prototype, "Subclass.prototype's prototype should be WritableStream.prototype");
    assert(Object.getPrototypeOf(Subclass) === WritableStream, "Subclass's prototype should be WritableStream");
    var sub = new Subclass();
    assert(_instanceof(sub, WritableStream), "Subclass object should be an instance of WritableStream");
    assert(_instanceof(sub, Subclass), "Subclass object should be an instance of Subclass");
    var lockedGetter = Object.getOwnPropertyDescriptor(WritableStream.prototype, "locked").get;
    assert(lockedGetter.call(sub) === sub.locked, "Subclass object should pass brand check");
    assert(sub.extraFunction(), "extraFunction() should be present on Subclass object");
});
unitTest(function lockedGetterShouldReturnTrue() {
    var ws = new WritableStream();
    assert(!ws.locked, "stream should not be locked");
    ws.getWriter();
    assert(ws.locked, "stream should be locked");
});
