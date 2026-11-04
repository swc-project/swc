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
// This code has been ported almost directly from Go's src/bytes/buffer_test.go
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
// https://github.com/golang/go/blob/master/LICENSE
import { assertEquals, assert, assertThrows, assertThrowsAsync, unitTest } from "./test_util.ts";
// N controls how many iterations of certain checks are performed.
var N = 100;
var testBytes;
var testString;
function init() {
    if (testBytes == null) {
        testBytes = new Uint8Array(N);
        for(var i = 0; i < N; i++){
            testBytes[i] = "a".charCodeAt(0) + i % 26;
        }
        var decoder = new TextDecoder();
        testString = decoder.decode(testBytes);
    }
}
function check(buf, s) {
    var bytes = buf.bytes();
    assertEquals(buf.length, bytes.byteLength);
    var decoder = new TextDecoder();
    var bytesStr = decoder.decode(bytes);
    assertEquals(bytesStr, s);
    assertEquals(buf.length, s.length);
}
// Fill buf through n writes of byte slice fub.
// The initial contents of buf corresponds to the string s;
// the result is the final contents of buf returned as a string.
function fillBytes(buf, s, n, fub) {
    return _async_to_generator(function() {
        var m, decoder;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    check(buf, s);
                    _state.label = 1;
                case 1:
                    if (!(n > 0)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        buf.write(fub)
                    ];
                case 2:
                    m = _state.sent();
                    assertEquals(m, fub.byteLength);
                    decoder = new TextDecoder();
                    s += decoder.decode(fub);
                    check(buf, s);
                    _state.label = 3;
                case 3:
                    n--;
                    return [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2,
                        s
                    ];
            }
        });
    })();
}
// Empty buf through repeated reads into fub.
// The initial contents of buf corresponds to the string s.
function empty(buf, s, fub) {
    return _async_to_generator(function() {
        var r;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    check(buf, s);
                    _state.label = 1;
                case 1:
                    if (!true) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        buf.read(fub)
                    ];
                case 2:
                    r = _state.sent();
                    if (r === null) {
                        return [
                            3,
                            3
                        ];
                    }
                    s = s.slice(r);
                    check(buf, s);
                    return [
                        3,
                        1
                    ];
                case 3:
                    check(buf, "");
                    return [
                        2
                    ];
            }
        });
    })();
}
function repeat(c, bytes) {
    assertEquals(c.length, 1);
    var ui8 = new Uint8Array(bytes);
    ui8.fill(c.charCodeAt(0));
    return ui8;
}
unitTest(function bufferNewBuffer() {
    init();
    assert(testBytes);
    assert(testString);
    var buf = new Deno.Buffer(testBytes.buffer);
    check(buf, testString);
});
unitTest(function bufferBasicOperations() {
    return _async_to_generator(function() {
        var buf, i, n;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    assert(testBytes);
                    assert(testString);
                    buf = new Deno.Buffer();
                    i = 0;
                    _state.label = 1;
                case 1:
                    if (!(i < 5)) return [
                        3,
                        8
                    ];
                    check(buf, "");
                    buf.reset();
                    check(buf, "");
                    buf.truncate(0);
                    check(buf, "");
                    return [
                        4,
                        buf.write(testBytes.subarray(0, 1))
                    ];
                case 2:
                    n = _state.sent();
                    assertEquals(n, 1);
                    check(buf, "a");
                    return [
                        4,
                        buf.write(testBytes.subarray(1, 2))
                    ];
                case 3:
                    n = _state.sent();
                    assertEquals(n, 1);
                    check(buf, "ab");
                    return [
                        4,
                        buf.write(testBytes.subarray(2, 26))
                    ];
                case 4:
                    n = _state.sent();
                    assertEquals(n, 24);
                    check(buf, testString.slice(0, 26));
                    buf.truncate(26);
                    check(buf, testString.slice(0, 26));
                    buf.truncate(20);
                    check(buf, testString.slice(0, 20));
                    return [
                        4,
                        empty(buf, testString.slice(0, 20), new Uint8Array(5))
                    ];
                case 5:
                    _state.sent();
                    return [
                        4,
                        empty(buf, "", new Uint8Array(100))
                    ];
                case 6:
                    _state.sent();
                    _state.label = 7;
                case 7:
                    i++;
                    return [
                        3,
                        1
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferReadEmptyAtEOF() {
    return _async_to_generator(function() {
        var buf, zeroLengthTmp, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // check that EOF of 'buf' is not reached (even though it's empty) if
                    // results are written to buffer that has 0 length (ie. it can't store any data)
                    buf = new Deno.Buffer();
                    zeroLengthTmp = new Uint8Array(0);
                    return [
                        4,
                        buf.read(zeroLengthTmp)
                    ];
                case 1:
                    result = _state.sent();
                    assertEquals(result, 0);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferLargeByteWrites() {
    return _async_to_generator(function() {
        var buf, limit, i, s;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    buf = new Deno.Buffer();
                    limit = 9;
                    i = 3;
                    _state.label = 1;
                case 1:
                    if (!(i < limit)) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        fillBytes(buf, "", 5, testBytes)
                    ];
                case 2:
                    s = _state.sent();
                    return [
                        4,
                        empty(buf, s, new Uint8Array(Math.floor(testString.length / i)))
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    i += 3;
                    return [
                        3,
                        1
                    ];
                case 5:
                    check(buf, "");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferTooLargeByteWrites() {
    return _async_to_generator(function() {
        var tmp, growLen, xBytes, buf;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    tmp = new Uint8Array(72);
                    growLen = Number.MAX_VALUE;
                    xBytes = repeat("x", 0);
                    buf = new Deno.Buffer(xBytes.buffer);
                    return [
                        4,
                        buf.read(tmp)
                    ];
                case 1:
                    _state.sent();
                    assertThrows(function() {
                        buf.grow(growLen);
                    }, Error, "grown beyond the maximum size");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferLargeByteReads() {
    return _async_to_generator(function() {
        var buf, i, n, s;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    assert(testBytes);
                    assert(testString);
                    buf = new Deno.Buffer();
                    i = 3;
                    _state.label = 1;
                case 1:
                    if (!(i < 30)) return [
                        3,
                        5
                    ];
                    n = Math.floor(testBytes.byteLength / i);
                    return [
                        4,
                        fillBytes(buf, "", 5, testBytes.subarray(0, n))
                    ];
                case 2:
                    s = _state.sent();
                    return [
                        4,
                        empty(buf, s, new Uint8Array(testString.length))
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    i += 3;
                    return [
                        3,
                        1
                    ];
                case 5:
                    check(buf, "");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferCapWithPreallocatedSlice() {
    var buf = new Deno.Buffer(new ArrayBuffer(10));
    assertEquals(buf.capacity, 10);
});
unitTest(function bufferReadFrom() {
    return _async_to_generator(function() {
        var buf, i, s, b, fub;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    assert(testBytes);
                    assert(testString);
                    buf = new Deno.Buffer();
                    i = 3;
                    _state.label = 1;
                case 1:
                    if (!(i < 30)) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        fillBytes(buf, "", 5, testBytes.subarray(0, Math.floor(testBytes.byteLength / i)))
                    ];
                case 2:
                    s = _state.sent();
                    b = new Deno.Buffer();
                    return [
                        4,
                        b.readFrom(buf)
                    ];
                case 3:
                    _state.sent();
                    fub = new Uint8Array(testString.length);
                    return [
                        4,
                        empty(b, s, fub)
                    ];
                case 4:
                    _state.sent();
                    _state.label = 5;
                case 5:
                    i += 3;
                    return [
                        3,
                        1
                    ];
                case 6:
                    assertThrowsAsync(function() {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            new Deno.Buffer().readFrom(null)
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
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferReadFromSync() {
    return _async_to_generator(function() {
        var buf, i, s, b, fub;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    assert(testBytes);
                    assert(testString);
                    buf = new Deno.Buffer();
                    i = 3;
                    _state.label = 1;
                case 1:
                    if (!(i < 30)) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        fillBytes(buf, "", 5, testBytes.subarray(0, Math.floor(testBytes.byteLength / i)))
                    ];
                case 2:
                    s = _state.sent();
                    b = new Deno.Buffer();
                    b.readFromSync(buf);
                    fub = new Uint8Array(testString.length);
                    return [
                        4,
                        empty(b, s, fub)
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    i += 3;
                    return [
                        3,
                        1
                    ];
                case 5:
                    assertThrows(function() {
                        new Deno.Buffer().readFromSync(null);
                    });
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bufferTestGrow() {
    return _async_to_generator(function() {
        var tmp, _i, _iter, startLen, xBytes, _i1, _iter1, growLen, _ref, buf, nread, yBytes;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tmp = new Uint8Array(72);
                    _i = 0, _iter = [
                        0,
                        100,
                        1000,
                        10000,
                        100000
                    ];
                    _state.label = 1;
                case 1:
                    if (!(_i < _iter.length)) return [
                        3,
                        7
                    ];
                    startLen = _iter[_i];
                    xBytes = repeat("x", startLen);
                    _i1 = 0, _iter1 = [
                        0,
                        100,
                        1000,
                        10000,
                        100000
                    ];
                    _state.label = 2;
                case 2:
                    if (!(_i1 < _iter1.length)) return [
                        3,
                        6
                    ];
                    growLen = _iter1[_i1];
                    buf = new Deno.Buffer(xBytes.buffer);
                    return [
                        4,
                        buf.read(tmp)
                    ];
                case 3:
                    nread = (_ref = _state.sent()) !== null && _ref !== void 0 ? _ref : 0;
                    buf.grow(growLen);
                    yBytes = repeat("y", growLen);
                    return [
                        4,
                        buf.write(yBytes)
                    ];
                case 4:
                    _state.sent();
                    // Check that buffer has correct data.
                    assertEquals(buf.bytes().subarray(0, startLen - nread), xBytes.subarray(nread));
                    assertEquals(buf.bytes().subarray(startLen - nread, startLen - nread + growLen), yBytes);
                    _state.label = 5;
                case 5:
                    _i1++;
                    return [
                        3,
                        2
                    ];
                case 6:
                    _i++;
                    return [
                        3,
                        1
                    ];
                case 7:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function testReadAll() {
    return _async_to_generator(function() {
        var reader, actualBytes, i;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    assert(testBytes);
                    reader = new Deno.Buffer(testBytes.buffer);
                    return [
                        4,
                        Deno.readAll(reader)
                    ];
                case 1:
                    actualBytes = _state.sent();
                    assertEquals(testBytes.byteLength, actualBytes.byteLength);
                    for(i = 0; i < testBytes.length; ++i){
                        assertEquals(testBytes[i], actualBytes[i]);
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function testReadAllSync() {
    init();
    assert(testBytes);
    var reader = new Deno.Buffer(testBytes.buffer);
    var actualBytes = Deno.readAllSync(reader);
    assertEquals(testBytes.byteLength, actualBytes.byteLength);
    for(var i = 0; i < testBytes.length; ++i){
        assertEquals(testBytes[i], actualBytes[i]);
    }
});
unitTest(function testWriteAll() {
    return _async_to_generator(function() {
        var writer, actualBytes, i;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    init();
                    assert(testBytes);
                    writer = new Deno.Buffer();
                    return [
                        4,
                        Deno.writeAll(writer, testBytes)
                    ];
                case 1:
                    _state.sent();
                    actualBytes = writer.bytes();
                    assertEquals(testBytes.byteLength, actualBytes.byteLength);
                    for(i = 0; i < testBytes.length; ++i){
                        assertEquals(testBytes[i], actualBytes[i]);
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function testWriteAllSync() {
    init();
    assert(testBytes);
    var writer = new Deno.Buffer();
    Deno.writeAllSync(writer, testBytes);
    var actualBytes = writer.bytes();
    assertEquals(testBytes.byteLength, actualBytes.byteLength);
    for(var i = 0; i < testBytes.length; ++i){
        assertEquals(testBytes[i], actualBytes[i]);
    }
});
unitTest(function testBufferBytesArrayBufferLength() {
    var bytes = new TextEncoder().encode("a");
    var reader = new Deno.Buffer();
    Deno.writeAllSync(reader, bytes);
    var writer = new Deno.Buffer();
    writer.readFromSync(reader);
    var actualBytes = writer.bytes();
    assertEquals(bytes.byteLength, 1);
    assertEquals(bytes.byteLength, actualBytes.buffer.byteLength);
});
