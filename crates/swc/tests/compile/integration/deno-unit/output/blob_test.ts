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
import { unitTest, assert, assertEquals } from "./test_util.ts";
import { concat } from "../../../std/bytes/mod.ts";
import { decode } from "../../../std/encoding/utf8.ts";
unitTest(function blobString() {
    var b1 = new Blob([
        "Hello World"
    ]);
    var str = "Test";
    var b2 = new Blob([
        b1,
        str
    ]);
    assertEquals(b2.size, b1.size + str.length);
});
unitTest(function blobBuffer() {
    var buffer = new ArrayBuffer(12);
    var u8 = new Uint8Array(buffer);
    var f1 = new Float32Array(buffer);
    var b1 = new Blob([
        buffer,
        u8
    ]);
    assertEquals(b1.size, 2 * u8.length);
    var b2 = new Blob([
        b1,
        f1
    ]);
    assertEquals(b2.size, 3 * u8.length);
});
unitTest(function blobSlice() {
    var blob = new Blob([
        "Deno",
        "Foo"
    ]);
    var b1 = blob.slice(0, 3, "Text/HTML");
    assert(_instanceof(b1, Blob));
    assertEquals(b1.size, 3);
    assertEquals(b1.type, "text/html");
    var b2 = blob.slice(-1, 3);
    assertEquals(b2.size, 0);
    var b3 = blob.slice(100, 3);
    assertEquals(b3.size, 0);
    var b4 = blob.slice(0, 10);
    assertEquals(b4.size, blob.size);
});
unitTest(function blobInvalidType() {
    var blob = new Blob([
        "foo"
    ], {
        type: "\u0521"
    });
    assertEquals(blob.type, "");
});
unitTest(function blobShouldNotThrowError() {
    var hasThrown = false;
    try {
        var options1 = {
            ending: "utf8",
            hasOwnProperty: "hasOwnProperty"
        };
        var options2 = Object.create(null);
        new Blob([
            "Hello World"
        ], options1);
        new Blob([
            "Hello World"
        ], options2);
    } catch (unused) {
        hasThrown = true;
    }
    assertEquals(hasThrown, false);
});
unitTest(function nativeEndLine() {
    var options = {
        ending: "native"
    };
    var blob = new Blob([
        "Hello\nWorld"
    ], options);
    assertEquals(blob.size, Deno.build.os === "windows" ? 12 : 11);
});
unitTest(function blobText() {
    return _async_to_generator(function() {
        var blob;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    blob = new Blob([
                        "Hello World"
                    ]);
                    return [
                        4,
                        blob.text()
                    ];
                case 1:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        "Hello World"
                    ]);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function blobStream() {
    return _async_to_generator(function() {
        var blob, stream, reader, bytes, read;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    blob = new Blob([
                        "Hello World"
                    ]);
                    stream = blob.stream();
                    assert(_instanceof(stream, ReadableStream));
                    reader = stream.getReader();
                    bytes = new Uint8Array();
                    read = function read1() {
                        return _async_to_generator(function() {
                            var _ref, done, value;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            reader.read()
                                        ];
                                    case 1:
                                        _ref = _state.sent(), done = _ref.done, value = _ref.value;
                                        if (!done && value) {
                                            bytes = concat(bytes, value);
                                            return [
                                                2,
                                                read()
                                            ];
                                        }
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    };
                    return [
                        4,
                        read()
                    ];
                case 1:
                    _state.sent();
                    assertEquals(decode(bytes), "Hello World");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function blobConstructorNameIsBlob() {
    var blob = new Blob();
    assertEquals(blob.constructor.name, "Blob");
});
