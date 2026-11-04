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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertNotEquals, assertThrows } from "./test_util.ts";
function delay(seconds) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, seconds);
    });
}
function readableStreamToArray(readable, reader) {
    if (reader === undefined) {
        reader = readable.getReader();
    }
    var chunks = [];
    return pump();
    function pump() {
        return reader.read().then(function(result) {
            if (result.done) {
                return chunks;
            }
            chunks.push(result.value);
            return pump();
        });
    }
}
unitTest(function transformStreamConstructedWithTransformFunction() {
    new TransformStream({
        transform: function transform() {}
    });
});
unitTest(function transformStreamConstructedNoTransform() {
    new TransformStream();
    new TransformStream({});
});
unitTest(function transformStreamInstancesHaveProperProperties() {
    var ts = new TransformStream({
        transform: function transform() {}
    });
    var proto = Object.getPrototypeOf(ts);
    var writableStream = Object.getOwnPropertyDescriptor(proto, "writable");
    assert(writableStream !== undefined, "it has a writable property");
    assert(!writableStream.enumerable, "writable should be non-enumerable");
    assertEquals(_type_of(writableStream.get), "function", "writable should have a getter");
    assertEquals(writableStream.set, undefined, "writable should not have a setter");
    assert(writableStream.configurable, "writable should be configurable");
    assert(_instanceof(ts.writable, WritableStream), "writable is an instance of WritableStream");
    assert(WritableStream.prototype.getWriter.call(ts.writable), "writable should pass WritableStream brand check");
    var readableStream = Object.getOwnPropertyDescriptor(proto, "readable");
    assert(readableStream !== undefined, "it has a readable property");
    assert(!readableStream.enumerable, "readable should be non-enumerable");
    assertEquals(_type_of(readableStream.get), "function", "readable should have a getter");
    assertEquals(readableStream.set, undefined, "readable should not have a setter");
    assert(readableStream.configurable, "readable should be configurable");
    assert(_instanceof(ts.readable, ReadableStream), "readable is an instance of ReadableStream");
    assertNotEquals(ReadableStream.prototype.getReader.call(ts.readable), undefined, "readable should pass ReadableStream brand check");
});
unitTest(function transformStreamWritableStartsAsWritable() {
    var ts = new TransformStream({
        transform: function transform() {}
    });
    var writer = ts.writable.getWriter();
    assertEquals(writer.desiredSize, 1, "writer.desiredSize should be 1");
});
unitTest(function transformStreamReadableCanReadOutOfWritable() {
    return _async_to_generator(function() {
        var ts, writer, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream();
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    assertEquals(writer.desiredSize, 0, "writer.desiredSize should be 0 after write()");
                    return [
                        4,
                        ts.readable.getReader().read()
                    ];
                case 1:
                    result = _state.sent();
                    assertEquals(result.value, "a", "result from reading the readable is the same as was written to writable");
                    assert(!result.done, "stream should not be done");
                    return [
                        4,
                        delay(0)
                    ];
                case 2:
                    _state.sent();
                    assert(writer.desiredSize === 1, "desiredSize should be 1 again");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamCanReadWhatIsWritten() {
    return _async_to_generator(function() {
        var c, ts, writer, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        start: function start(controller) {
                            c = controller;
                        },
                        transform: function transform(chunk) {
                            c.enqueue(chunk.toUpperCase());
                        }
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    return [
                        4,
                        ts.readable.getReader().read()
                    ];
                case 1:
                    result = _state.sent();
                    assertEquals(result.value, "A", "result from reading the readable is the transformation of what was written to writable");
                    assert(!result.done, "stream should not be done");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamCanReadBothChunks() {
    return _async_to_generator(function() {
        var c, ts, writer, reader, result1, result2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        start: function start(controller) {
                            c = controller;
                        },
                        transform: function transform(chunk) {
                            c.enqueue(chunk.toUpperCase());
                            c.enqueue(chunk.toUpperCase());
                        }
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    reader = ts.readable.getReader();
                    return [
                        4,
                        reader.read()
                    ];
                case 1:
                    result1 = _state.sent();
                    assertEquals(result1.value, "A", "the first chunk read is the transformation of the single chunk written");
                    assert(!result1.done, "stream should not be done");
                    return [
                        4,
                        reader.read()
                    ];
                case 2:
                    result2 = _state.sent();
                    assertEquals(result2.value, "A", "the second chunk read is also the transformation of the single chunk written");
                    assert(!result2.done, "stream should not be done");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamCanReadWhatIsWritten() {
    return _async_to_generator(function() {
        var c, ts, writer, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        start: function start(controller) {
                            c = controller;
                        },
                        transform: function transform(chunk) {
                            return delay(0).then(function() {
                                return c.enqueue(chunk.toUpperCase());
                            });
                        }
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    return [
                        4,
                        ts.readable.getReader().read()
                    ];
                case 1:
                    result = _state.sent();
                    assertEquals(result.value, "A", "result from reading the readable is the transformation of what was written to writable");
                    assert(!result.done, "stream should not be done");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamAsyncReadMultipleChunks() {
    return _async_to_generator(function() {
        var doSecondEnqueue, returnFromTransform, ts, reader, writer, result1, result2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        transform: function transform(chunk, controller) {
                            delay(0).then(function() {
                                return controller.enqueue(chunk.toUpperCase());
                            });
                            doSecondEnqueue = function doSecondEnqueue() {
                                return controller.enqueue(chunk.toUpperCase());
                            };
                            return new Promise(function(resolve) {
                                returnFromTransform = resolve;
                            });
                        }
                    });
                    reader = ts.readable.getReader();
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    return [
                        4,
                        reader.read()
                    ];
                case 1:
                    result1 = _state.sent();
                    assertEquals(result1.value, "A", "the first chunk read is the transformation of the single chunk written");
                    assert(!result1.done, "stream should not be done");
                    doSecondEnqueue();
                    return [
                        4,
                        reader.read()
                    ];
                case 2:
                    result2 = _state.sent();
                    assertEquals(result2.value, "A", "the second chunk read is also the transformation of the single chunk written");
                    assert(!result2.done, "stream should not be done");
                    returnFromTransform();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamClosingWriteClosesRead() {
    var ts = new TransformStream({
        transform: function transform() {}
    });
    var writer = ts.writable.getWriter();
    writer.close();
    return Promise.all([
        writer.closed,
        ts.readable.getReader().closed
    ]).then(undefined);
});
unitTest(function transformStreamCloseWaitAwaitsTransforms() {
    return _async_to_generator(function() {
        var transformResolve, transformPromise, ts, writer, rsClosed;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    transformPromise = new Promise(function(resolve) {
                        transformResolve = resolve;
                    });
                    ts = new TransformStream({
                        transform: function transform() {
                            return transformPromise;
                        }
                    }, undefined, {
                        highWaterMark: 1
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    writer.close();
                    rsClosed = false;
                    ts.readable.getReader().closed.then(function() {
                        rsClosed = true;
                    });
                    return [
                        4,
                        delay(0)
                    ];
                case 1:
                    _state.sent();
                    assertEquals(rsClosed, false, "readable is not closed after a tick");
                    transformResolve();
                    return [
                        4,
                        writer.closed
                    ];
                case 2:
                    _state.sent();
                    // TODO: Is this expectation correct?
                    assertEquals(rsClosed, true, "readable is closed at that point");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamCloseWriteAfterSyncEnqueues() {
    return _async_to_generator(function() {
        var c, ts, writer, readableChunks, chunks;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        start: function start(controller) {
                            c = controller;
                        },
                        transform: function transform() {
                            c.enqueue("x");
                            c.enqueue("y");
                            return delay(0);
                        }
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    writer.close();
                    readableChunks = readableStreamToArray(ts.readable);
                    return [
                        4,
                        writer.closed
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        readableChunks
                    ];
                case 2:
                    chunks = _state.sent();
                    assertEquals(chunks, [
                        "x",
                        "y"
                    ], "both enqueued chunks can be read from the readable");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamWritableCloseAsyncAfterAsyncEnqueues() {
    return _async_to_generator(function() {
        var c, ts, writer, readableChunks, chunks;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        start: function start(controller) {
                            c = controller;
                        },
                        transform: function transform() {
                            return delay(0).then(function() {
                                return c.enqueue("x");
                            }).then(function() {
                                return c.enqueue("y");
                            }).then(function() {
                                return delay(0);
                            });
                        }
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    writer.close();
                    readableChunks = readableStreamToArray(ts.readable);
                    return [
                        4,
                        writer.closed
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        readableChunks
                    ];
                case 2:
                    chunks = _state.sent();
                    assertEquals(chunks, [
                        "x",
                        "y"
                    ], "both enqueued chunks can be read from the readable");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamTransformerMethodsCalledAsMethods() {
    return _async_to_generator(function() {
        var c, transformer, ts, writer, readableChunks, chunks;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    transformer = {
                        suffix: "-suffix",
                        start: function start(controller) {
                            c = controller;
                            c.enqueue("start" + this.suffix);
                        },
                        transform: function transform(chunk) {
                            c.enqueue(chunk + this.suffix);
                        },
                        flush: function flush() {
                            c.enqueue("flushed" + this.suffix);
                        }
                    };
                    ts = new TransformStream(transformer);
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    writer.close();
                    readableChunks = readableStreamToArray(ts.readable);
                    return [
                        4,
                        writer.closed
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        readableChunks
                    ];
                case 2:
                    chunks = _state.sent();
                    assertEquals(chunks, [
                        "start-suffix",
                        "a-suffix",
                        "flushed-suffix"
                    ], "all enqueued chunks have suffixes");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamMethodsShouldNotBeAppliedOrCalled() {
    return _async_to_generator(function() {
        var ts, writer;
        function functionWithOverloads() {}
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    functionWithOverloads.apply = function() {
                        throw new Error("apply() should not be called");
                    };
                    functionWithOverloads.call = function() {
                        throw new Error("call() should not be called");
                    };
                    ts = new TransformStream({
                        start: functionWithOverloads,
                        transform: functionWithOverloads,
                        flush: functionWithOverloads
                    });
                    writer = ts.writable.getWriter();
                    writer.write("a");
                    writer.close();
                    return [
                        4,
                        readableStreamToArray(ts.readable)
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
unitTest(function transformStreamCallTransformSync() {
    return _async_to_generator(function() {
        var transformCalled, ts, writePromise;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    transformCalled = false;
                    ts = new TransformStream({
                        transform: function transform() {
                            transformCalled = true;
                        }
                    }, undefined, {
                        highWaterMark: Infinity
                    });
                    // transform() is only called synchronously when there is no backpressure and
                    // all microtasks have run.
                    return [
                        4,
                        delay(0)
                    ];
                case 1:
                    _state.sent();
                    writePromise = ts.writable.getWriter().write(undefined);
                    assert(transformCalled, "transform() should have been called");
                    return [
                        4,
                        writePromise
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
unitTest(function transformStreamCloseWriteClosesReadWithNoChunks() {
    var ts = new TransformStream({}, undefined, {
        highWaterMark: 0
    });
    var writer = ts.writable.getWriter();
    writer.close();
    return Promise.all([
        writer.closed,
        ts.readable.getReader().closed
    ]).then(undefined);
});
unitTest(function transformStreamEnqueueThrowsAfterTerminate() {
    new TransformStream({
        start: function start(controller) {
            controller.terminate();
            assertThrows(function() {
                controller.enqueue(undefined);
            }, TypeError);
        }
    });
});
unitTest(function transformStreamEnqueueThrowsAfterReadableCancel() {
    var controller;
    var ts = new TransformStream({
        start: function start(c) {
            controller = c;
        }
    });
    var cancelPromise = ts.readable.cancel();
    assertThrows(function() {
        return controller.enqueue(undefined);
    }, TypeError, undefined, "enqueue should throw");
    return cancelPromise;
});
unitTest(function transformStreamSecondTerminateNoOp() {
    new TransformStream({
        start: function start(controller) {
            controller.terminate();
            controller.terminate();
        }
    });
});
unitTest(function transformStreamTerminateAfterReadableCancelIsNoop() {
    return _async_to_generator(function() {
        var controller, ts, cancelReason, cancelPromise, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    ts = new TransformStream({
                        start: function start(c) {
                            controller = c;
                        }
                    });
                    cancelReason = {
                        name: "cancelReason"
                    };
                    cancelPromise = ts.readable.cancel(cancelReason);
                    controller.terminate();
                    return [
                        4,
                        cancelPromise
                    ];
                case 1:
                    _state.sent();
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        ts.writable.getWriter().closed
                    ];
                case 3:
                    _state.sent();
                    return [
                        3,
                        5
                    ];
                case 4:
                    e = _state.sent();
                    assert(e === cancelReason);
                    return [
                        2
                    ];
                case 5:
                    throw new Error("closed should have rejected");
            }
        });
    })();
});
unitTest(function transformStreamStartCalledOnce() {
    return _async_to_generator(function() {
        var calls;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    calls = 0;
                    new TransformStream({
                        start: function start() {
                            ++calls;
                        }
                    });
                    return [
                        4,
                        delay(0)
                    ];
                case 1:
                    _state.sent();
                    assertEquals(calls, 1, "start() should have been called exactly once");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function transformStreamReadableTypeThrows() {
    assertThrows(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    function() {
        return new TransformStream({
            readableType: "bytes"
        });
    }, RangeError, undefined, "constructor should throw");
});
unitTest(function transformStreamWritableTypeThrows() {
    assertThrows(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    function() {
        return new TransformStream({
            writableType: "bytes"
        });
    }, RangeError, undefined, "constructor should throw");
});
unitTest(function transformStreamSubclassable() {
    var Subclass = /*#__PURE__*/ function(TransformStream1) {
        "use strict";
        _inherits(Subclass, TransformStream1);
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
    }(TransformStream);
    assert(Object.getPrototypeOf(Subclass.prototype) === TransformStream.prototype, "Subclass.prototype's prototype should be TransformStream.prototype");
    assert(Object.getPrototypeOf(Subclass) === TransformStream, "Subclass's prototype should be TransformStream");
    var sub = new Subclass();
    assert(_instanceof(sub, TransformStream), "Subclass object should be an instance of TransformStream");
    assert(_instanceof(sub, Subclass), "Subclass object should be an instance of Subclass");
    var readableGetter = Object.getOwnPropertyDescriptor(TransformStream.prototype, "readable").get;
    assert(readableGetter.call(sub) === sub.readable, "Subclass object should pass brand check");
    assert(sub.extraFunction(), "extraFunction() should be present on Subclass object");
});
