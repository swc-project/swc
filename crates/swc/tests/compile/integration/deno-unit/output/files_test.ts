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
function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) return descriptor.get.call(receiver);
    return descriptor.value;
}
function _class_apply_descriptor_set(receiver, descriptor, value) {
    if (descriptor.set) descriptor.set.call(receiver, value);
    else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertThrowsAsync } from "./test_util.ts";
unitTest(function filesStdioFileDescriptors() {
    assertEquals(Deno.stdin.rid, 0);
    assertEquals(Deno.stdout.rid, 1);
    assertEquals(Deno.stderr.rid, 2);
});
unitTest({
    perms: {
        read: true
    }
}, function filesCopyToStdout() {
    return _async_to_generator(function() {
        var filename, file, bytesWritten, fileSize;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/fixture.json";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    assert(file.rid > 2);
                    return [
                        4,
                        Deno.copy(file, Deno.stdout)
                    ];
                case 2:
                    bytesWritten = _state.sent();
                    fileSize = Deno.statSync(filename).size;
                    assertEquals(bytesWritten, fileSize);
                    console.log("bytes written", bytesWritten);
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function filesIter() {
    return _async_to_generator(function() {
        var filename, file, totalSize, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, buf, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/hello.txt";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    totalSize = 0;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        7,
                        8,
                        13
                    ]);
                    _iterator = _async_iterator(Deno.iter(file));
                    _state.label = 3;
                case 3:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 4:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        6
                    ];
                    _value = _step.value;
                    buf = _value;
                    totalSize += buf.byteLength;
                    _state.label = 5;
                case 5:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        3
                    ];
                case 6:
                    return [
                        3,
                        13
                    ];
                case 7:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        13
                    ];
                case 8:
                    _state.trys.push([
                        8,
                        ,
                        11,
                        12
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        10
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 9:
                    _state.sent();
                    _state.label = 10;
                case 10:
                    return [
                        3,
                        12
                    ];
                case 11:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 12:
                    return [
                        7
                    ];
                case 13:
                    assertEquals(totalSize, 12);
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function filesIterCustomBufSize() {
    return _async_to_generator(function() {
        var filename, file, totalSize, iterations, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, buf, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/hello.txt";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    totalSize = 0;
                    iterations = 0;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        7,
                        8,
                        13
                    ]);
                    _iterator = _async_iterator(Deno.iter(file, {
                        bufSize: 6
                    }));
                    _state.label = 3;
                case 3:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 4:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        6
                    ];
                    _value = _step.value;
                    buf = _value;
                    totalSize += buf.byteLength;
                    iterations += 1;
                    _state.label = 5;
                case 5:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        3
                    ];
                case 6:
                    return [
                        3,
                        13
                    ];
                case 7:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        13
                    ];
                case 8:
                    _state.trys.push([
                        8,
                        ,
                        11,
                        12
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        10
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 9:
                    _state.sent();
                    _state.label = 10;
                case 10:
                    return [
                        3,
                        12
                    ];
                case 11:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 12:
                    return [
                        7
                    ];
                case 13:
                    assertEquals(totalSize, 12);
                    assertEquals(iterations, 2);
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function filesIterSync() {
    var filename = "cli/tests/hello.txt";
    var file = Deno.openSync(filename);
    var totalSize = 0;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Deno.iterSync(file)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var buf = _step.value;
            totalSize += buf.byteLength;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    assertEquals(totalSize, 12);
    file.close();
});
unitTest({
    perms: {
        read: true
    }
}, function filesIterSyncCustomBufSize() {
    var filename = "cli/tests/hello.txt";
    var file = Deno.openSync(filename);
    var totalSize = 0;
    var iterations = 0;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Deno.iterSync(file, {
            bufSize: 6
        })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var buf = _step.value;
            totalSize += buf.byteLength;
            iterations += 1;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    assertEquals(totalSize, 12);
    assertEquals(iterations, 2);
    file.close();
});
unitTest(function readerIter() {
    return _async_to_generator(function() {
        var encoder, _offset, _buf, TestReader, reader, totalSize, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, buf, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // ref: https://github.com/denoland/deno/issues/2330
                    encoder = new TextEncoder();
                    _offset = /*#__PURE__*/ new WeakMap(), _buf = /*#__PURE__*/ new WeakMap();
                    TestReader = /*#__PURE__*/ function() {
                        "use strict";
                        function TestReader(s) {
                            _class_call_check(this, TestReader);
                            _class_private_field_init(this, _offset, {
                                writable: true,
                                value: 0
                            });
                            _class_private_field_init(this, _buf, {
                                writable: true,
                                value: void 0
                            });
                            _class_private_field_set(this, _buf, new Uint8Array(encoder.encode(s)));
                        }
                        _create_class(TestReader, [
                            {
                                key: "read",
                                value: function read(p) {
                                    var n = Math.min(p.byteLength, _class_private_field_get(this, _buf).byteLength - _class_private_field_get(this, _offset));
                                    p.set(_class_private_field_get(this, _buf).slice(_class_private_field_get(this, _offset), _class_private_field_get(this, _offset) + n));
                                    _class_private_field_set(this, _offset, _class_private_field_get(this, _offset) + n);
                                    if (n === 0) {
                                        return Promise.resolve(null);
                                    }
                                    return Promise.resolve(n);
                                }
                            }
                        ]);
                        return TestReader;
                    }();
                    reader = new TestReader("hello world!");
                    totalSize = 0;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator(Deno.iter(reader));
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
                    buf = _value;
                    totalSize += buf.byteLength;
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
                    assertEquals(totalSize, 12);
                    return [
                        2
                    ];
            }
        });
    }).call(this);
});
unitTest(function readerIterSync() {
    return _async_to_generator(function() {
        var encoder, _offset, _buf, TestReader, reader, totalSize, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, buf, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // ref: https://github.com/denoland/deno/issues/2330
                    encoder = new TextEncoder();
                    _offset = /*#__PURE__*/ new WeakMap(), _buf = /*#__PURE__*/ new WeakMap();
                    TestReader = /*#__PURE__*/ function() {
                        "use strict";
                        function TestReader(s) {
                            _class_call_check(this, TestReader);
                            _class_private_field_init(this, _offset, {
                                writable: true,
                                value: 0
                            });
                            _class_private_field_init(this, _buf, {
                                writable: true,
                                value: void 0
                            });
                            _class_private_field_set(this, _buf, new Uint8Array(encoder.encode(s)));
                        }
                        _create_class(TestReader, [
                            {
                                key: "readSync",
                                value: function readSync(p) {
                                    var n = Math.min(p.byteLength, _class_private_field_get(this, _buf).byteLength - _class_private_field_get(this, _offset));
                                    p.set(_class_private_field_get(this, _buf).slice(_class_private_field_get(this, _offset), _class_private_field_get(this, _offset) + n));
                                    _class_private_field_set(this, _offset, _class_private_field_get(this, _offset) + n);
                                    if (n === 0) {
                                        return null;
                                    }
                                    return n;
                                }
                            }
                        ]);
                        return TestReader;
                    }();
                    reader = new TestReader("hello world!");
                    totalSize = 0;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator(Deno.iterSync(reader));
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
                    buf = _value;
                    totalSize += buf.byteLength;
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
                    assertEquals(totalSize, 12);
                    return [
                        2
                    ];
            }
        });
    }).call(this);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function openSyncMode() {
    var path = Deno.makeTempDirSync() + "/test_openSync.txt";
    var file = Deno.openSync(path, {
        write: true,
        createNew: true,
        mode: 406
    });
    file.close();
    var pathInfo = Deno.statSync(path);
    if (Deno.build.os !== "windows") {
        assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
    }
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function openMode() {
    return _async_to_generator(function() {
        var path, file, pathInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    path = _state.sent() + "/test_open.txt";
                    return [
                        4,
                        Deno.open(path, {
                            write: true,
                            createNew: true,
                            mode: 406
                        })
                    ];
                case 2:
                    file = _state.sent();
                    file.close();
                    pathInfo = Deno.statSync(path);
                    if (Deno.build.os !== "windows") {
                        assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function openSyncUrl() {
    var tempDir = Deno.makeTempDirSync();
    var fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test_open.txt"));
    var file = Deno.openSync(fileUrl, {
        write: true,
        createNew: true,
        mode: 406
    });
    file.close();
    var pathInfo = Deno.statSync(fileUrl);
    if (Deno.build.os !== "windows") {
        assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
    }
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function openUrl() {
    return _async_to_generator(function() {
        var tempDir, fileUrl, file, pathInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test_open.txt"));
                    return [
                        4,
                        Deno.open(fileUrl, {
                            write: true,
                            createNew: true,
                            mode: 406
                        })
                    ];
                case 2:
                    file = _state.sent();
                    file.close();
                    pathInfo = Deno.statSync(fileUrl);
                    if (Deno.build.os !== "windows") {
                        assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
                    }
                    Deno.removeSync(tempDir, {
                        recursive: true
                    });
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        write: false
    }
}, function writePermFailure() {
    return _async_to_generator(function() {
        var filename, openOptions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "tests/hello.txt";
                    openOptions = [
                        {
                            write: true
                        },
                        {
                            append: true
                        }
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
                        var options;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    options = _step.value;
                                    return [
                                        4,
                                        assertThrowsAsync(function() {
                                            return _async_to_generator(function() {
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            return [
                                                                4,
                                                                Deno.open(filename, options)
                                                            ];
                                                        case 1:
                                                            _state.sent();
                                                            return [
                                                                2
                                                            ];
                                                    }
                                                });
                                            })();
                                        }, Deno.errors.PermissionDenied)
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = openOptions[Symbol.iterator]();
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
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function openOptions() {
    return _async_to_generator(function() {
        var filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/fixture.json";
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.open(filename, {
                                                    write: false
                                                })
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Error, "OpenOptions requires at least one option to be true")
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.open(filename, {
                                                    truncate: true,
                                                    write: false
                                                })
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Error, "'truncate' option requires 'write' option")
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.open(filename, {
                                                    create: true,
                                                    write: false
                                                })
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Error, "'create' or 'createNew' options require 'write' or 'append' option")
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.open(filename, {
                                                    createNew: true,
                                                    append: false
                                                })
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Error, "'create' or 'createNew' options require 'write' or 'append' option")
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: false
    }
}, function readPermFailure() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.open("package.json", {
                                                    read: true
                                                })
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.PermissionDenied)
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
unitTest({
    perms: {
        write: true
    }
}, function writeNullBufferFailure() {
    return _async_to_generator(function() {
        var tempDir, filename, w, file;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    filename = tempDir + "hello.txt";
                    w = {
                        write: true,
                        truncate: true,
                        create: true
                    };
                    return [
                        4,
                        Deno.open(filename, w)
                    ];
                case 1:
                    file = _state.sent();
                    // writing null should throw an error
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            return [
                                                4,
                                                file.write(null)
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        })
                    ];
                case 2:
                    _state.sent(); // TODO: Check error kind when dispatch_minimal pipes errors properly
                    file.close();
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        write: true,
        read: true
    }
}, function readNullBufferFailure() {
    return _async_to_generator(function() {
        var tempDir, filename, file, bytesRead;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    filename = tempDir + "hello.txt";
                    return [
                        4,
                        Deno.open(filename, {
                            read: true,
                            write: true,
                            truncate: true,
                            create: true
                        })
                    ];
                case 1:
                    file = _state.sent();
                    return [
                        4,
                        file.read(new Uint8Array(0))
                    ];
                case 2:
                    bytesRead = _state.sent();
                    assert(bytesRead === 0);
                    // reading file into null buffer should throw an error
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            return [
                                                4,
                                                file.read(null)
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, TypeError)
                    ];
                case 3:
                    _state.sent();
                    // TODO: Check error kind when dispatch_minimal pipes errors properly
                    file.close();
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        write: false,
        read: false
    }
}, function readWritePermFailure() {
    return _async_to_generator(function() {
        var filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "tests/hello.txt";
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.open(filename, {
                                                    read: true
                                                })
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.PermissionDenied)
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
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function createFile() {
    return _async_to_generator(function() {
        var tempDir, filename, f, fileInfo, enc, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    filename = tempDir + "/test.txt";
                    return [
                        4,
                        Deno.create(filename)
                    ];
                case 2:
                    f = _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.isFile);
                    assert(fileInfo.size === 0);
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    return [
                        4,
                        f.write(data)
                    ];
                case 3:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.size === 5);
                    f.close();
                    // TODO: test different modes
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function createFileWithUrl() {
    return _async_to_generator(function() {
        var tempDir, fileUrl, f, fileInfo, enc, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
                    return [
                        4,
                        Deno.create(fileUrl)
                    ];
                case 2:
                    f = _state.sent();
                    fileInfo = Deno.statSync(fileUrl);
                    assert(fileInfo.isFile);
                    assert(fileInfo.size === 0);
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    return [
                        4,
                        f.write(data)
                    ];
                case 3:
                    _state.sent();
                    fileInfo = Deno.statSync(fileUrl);
                    assert(fileInfo.size === 5);
                    f.close();
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function createSyncFile() {
    return _async_to_generator(function() {
        var tempDir, filename, f, fileInfo, enc, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    filename = tempDir + "/test.txt";
                    f = Deno.createSync(filename);
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.isFile);
                    assert(fileInfo.size === 0);
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    return [
                        4,
                        f.write(data)
                    ];
                case 2:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.size === 5);
                    f.close();
                    // TODO: test different modes
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function createSyncFileWithUrl() {
    return _async_to_generator(function() {
        var tempDir, fileUrl, f, fileInfo, enc, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
                    f = Deno.createSync(fileUrl);
                    fileInfo = Deno.statSync(fileUrl);
                    assert(fileInfo.isFile);
                    assert(fileInfo.size === 0);
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    return [
                        4,
                        f.write(data)
                    ];
                case 2:
                    _state.sent();
                    fileInfo = Deno.statSync(fileUrl);
                    assert(fileInfo.size === 5);
                    f.close();
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function openModeWrite() {
    return _async_to_generator(function() {
        var tempDir, encoder, filename, data, file, fileInfo, thrown, buf, e, fileSize;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    encoder = new TextEncoder();
                    filename = tempDir + "hello.txt";
                    data = encoder.encode("Hello world!\n");
                    return [
                        4,
                        Deno.open(filename, {
                            create: true,
                            write: true,
                            truncate: true
                        })
                    ];
                case 1:
                    file = _state.sent();
                    // assert file was created
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.isFile);
                    assertEquals(fileInfo.size, 0);
                    // write some data
                    return [
                        4,
                        file.write(data)
                    ];
                case 2:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assertEquals(fileInfo.size, 13);
                    // assert we can't read from file
                    thrown = false;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        5,
                        6,
                        7
                    ]);
                    buf = new Uint8Array(20);
                    return [
                        4,
                        file.read(buf)
                    ];
                case 4:
                    _state.sent();
                    return [
                        3,
                        7
                    ];
                case 5:
                    e = _state.sent();
                    thrown = true;
                    return [
                        3,
                        7
                    ];
                case 6:
                    assert(thrown, "'w' mode shouldn't allow to read file");
                    return [
                        7
                    ];
                case 7:
                    file.close();
                    return [
                        4,
                        Deno.open(filename, {
                            write: true,
                            truncate: true
                        })
                    ];
                case 8:
                    // assert that existing file is truncated on open
                    file = _state.sent();
                    file.close();
                    fileSize = Deno.statSync(filename).size;
                    assertEquals(fileSize, 0);
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 9:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function openModeWriteRead() {
    return _async_to_generator(function() {
        var tempDir, encoder, filename, data, file, seekPosition, fileInfo, buf, cursorPosition, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    encoder = new TextEncoder();
                    filename = tempDir + "hello.txt";
                    data = encoder.encode("Hello world!\n");
                    return [
                        4,
                        Deno.open(filename, {
                            write: true,
                            truncate: true,
                            create: true,
                            read: true
                        })
                    ];
                case 1:
                    file = _state.sent();
                    seekPosition = 0;
                    // assert file was created
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.isFile);
                    assertEquals(fileInfo.size, 0);
                    // write some data
                    return [
                        4,
                        file.write(data)
                    ];
                case 2:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assertEquals(fileInfo.size, 13);
                    buf = new Uint8Array(20);
                    return [
                        4,
                        file.seek(seekPosition, Deno.SeekMode.Start)
                    ];
                case 3:
                    cursorPosition = _state.sent();
                    assertEquals(seekPosition, cursorPosition);
                    return [
                        4,
                        file.read(buf)
                    ];
                case 4:
                    result = _state.sent();
                    assertEquals(result, 13);
                    file.close();
                    return [
                        4,
                        Deno.remove(tempDir, {
                            recursive: true
                        })
                    ];
                case 5:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function seekStart() {
    return _async_to_generator(function() {
        var filename, file, seekPosition, cursorPosition, buf, decoded;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/hello.txt";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    seekPosition = 6;
                    // Deliberately move 1 step forward
                    return [
                        4,
                        file.read(new Uint8Array(1))
                    ];
                case 2:
                    _state.sent(); // "H"
                    return [
                        4,
                        file.seek(seekPosition, Deno.SeekMode.Start)
                    ];
                case 3:
                    cursorPosition = _state.sent();
                    assertEquals(seekPosition, cursorPosition);
                    buf = new Uint8Array(6);
                    return [
                        4,
                        file.read(buf)
                    ];
                case 4:
                    _state.sent();
                    decoded = new TextDecoder().decode(buf);
                    assertEquals(decoded, "world!");
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function seekSyncStart() {
    var filename = "cli/tests/hello.txt";
    var file = Deno.openSync(filename);
    var seekPosition = 6;
    // Deliberately move 1 step forward
    file.readSync(new Uint8Array(1)); // "H"
    // Skipping "Hello "
    // seeking from beginning of a file plus seekPosition
    var cursorPosition = file.seekSync(seekPosition, Deno.SeekMode.Start);
    assertEquals(seekPosition, cursorPosition);
    var buf = new Uint8Array(6);
    file.readSync(buf);
    var decoded = new TextDecoder().decode(buf);
    assertEquals(decoded, "world!");
    file.close();
});
unitTest({
    perms: {
        read: true
    }
}, function seekCurrent() {
    return _async_to_generator(function() {
        var filename, file, seekPosition, cursorPosition, buf, decoded;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/hello.txt";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    // Deliberately move 1 step forward
                    return [
                        4,
                        file.read(new Uint8Array(1))
                    ];
                case 2:
                    _state.sent(); // "H"
                    // Skipping "ello "
                    seekPosition = 5;
                    return [
                        4,
                        file.seek(seekPosition, Deno.SeekMode.Current)
                    ];
                case 3:
                    cursorPosition = _state.sent();
                    assertEquals(seekPosition + 1, cursorPosition);
                    buf = new Uint8Array(6);
                    return [
                        4,
                        file.read(buf)
                    ];
                case 4:
                    _state.sent();
                    decoded = new TextDecoder().decode(buf);
                    assertEquals(decoded, "world!");
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function seekSyncCurrent() {
    var filename = "cli/tests/hello.txt";
    var file = Deno.openSync(filename);
    // Deliberately move 1 step forward
    file.readSync(new Uint8Array(1)); // "H"
    // Skipping "ello "
    var seekPosition = 5;
    // seekPosition is relative to current cursor position after read
    var cursorPosition = file.seekSync(seekPosition, Deno.SeekMode.Current);
    assertEquals(seekPosition + 1, cursorPosition);
    var buf = new Uint8Array(6);
    file.readSync(buf);
    var decoded = new TextDecoder().decode(buf);
    assertEquals(decoded, "world!");
    file.close();
});
unitTest({
    perms: {
        read: true
    }
}, function seekEnd() {
    return _async_to_generator(function() {
        var filename, file, seekPosition, cursorPosition, buf, decoded;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/hello.txt";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    seekPosition = -6;
                    return [
                        4,
                        file.seek(seekPosition, Deno.SeekMode.End)
                    ];
                case 2:
                    cursorPosition = _state.sent();
                    assertEquals(6, cursorPosition);
                    buf = new Uint8Array(6);
                    return [
                        4,
                        file.read(buf)
                    ];
                case 3:
                    _state.sent();
                    decoded = new TextDecoder().decode(buf);
                    assertEquals(decoded, "world!");
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: true
    }
}, function seekSyncEnd() {
    var filename = "cli/tests/hello.txt";
    var file = Deno.openSync(filename);
    var seekPosition = -6;
    // seek from end of file that has 12 chars, 12 - 6  = 6
    var cursorPosition = file.seekSync(seekPosition, Deno.SeekMode.End);
    assertEquals(6, cursorPosition);
    var buf = new Uint8Array(6);
    file.readSync(buf);
    var decoded = new TextDecoder().decode(buf);
    assertEquals(decoded, "world!");
    file.close();
});
unitTest({
    perms: {
        read: true
    }
}, function seekMode() {
    return _async_to_generator(function() {
        var filename, file, buf;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "cli/tests/hello.txt";
                    return [
                        4,
                        Deno.open(filename)
                    ];
                case 1:
                    file = _state.sent();
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                file.seek(1, -1)
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, TypeError, "Invalid seek mode")
                    ];
                case 2:
                    _state.sent();
                    // We should still be able to read the file
                    // since it is still open.
                    buf = new Uint8Array(1);
                    return [
                        4,
                        file.read(buf)
                    ];
                case 3:
                    _state.sent(); // "H"
                    assertEquals(new TextDecoder().decode(buf), "H");
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
