function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assert, assertEquals, assertThrows, assertThrowsAsync, createResolvable, unitTest } from "./test_util.ts";
import { BufWriter, BufReader } from "../../../std/io/bufio.ts";
import { TextProtoReader } from "../../../std/textproto/mod.ts";
var encoder = new TextEncoder();
var decoder = new TextDecoder();
unitTest(function connectTLSNoPerm() {
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
                                                Deno.connectTls({
                                                    hostname: "github.com",
                                                    port: 443
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
unitTest(function connectTLSCertFileNoReadPerm() {
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
                                                Deno.connectTls({
                                                    hostname: "github.com",
                                                    port: 443,
                                                    certFile: "cli/tests/tls/RootCA.crt"
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
        net: true
    }
}, function listenTLSNonExistentCertKeyFiles() {
    var options = {
        hostname: "localhost",
        port: 3500,
        certFile: "cli/tests/tls/localhost.crt",
        keyFile: "cli/tests/tls/localhost.key"
    };
    assertThrows(function() {
        Deno.listenTls(_object_spread_props(_object_spread({}, options), {
            certFile: "./non/existent/file"
        }));
    }, Deno.errors.NotFound);
    assertThrows(function() {
        Deno.listenTls(_object_spread_props(_object_spread({}, options), {
            keyFile: "./non/existent/file"
        }));
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        net: true
    }
}, function listenTLSNoReadPerm() {
    assertThrows(function() {
        Deno.listenTls({
            hostname: "localhost",
            port: 3500,
            certFile: "cli/tests/tls/localhost.crt",
            keyFile: "cli/tests/tls/localhost.key"
        });
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true,
        net: true
    }
}, function listenTLSEmptyKeyFile() {
    var options = {
        hostname: "localhost",
        port: 3500,
        certFile: "cli/tests/tls/localhost.crt",
        keyFile: "cli/tests/tls/localhost.key"
    };
    var testDir = Deno.makeTempDirSync();
    var keyFilename = testDir + "/key.pem";
    Deno.writeFileSync(keyFilename, new Uint8Array([]), {
        mode: 438
    });
    assertThrows(function() {
        Deno.listenTls(_object_spread_props(_object_spread({}, options), {
            keyFile: keyFilename
        }));
    }, Error);
});
unitTest({
    perms: {
        read: true,
        write: true,
        net: true
    }
}, function listenTLSEmptyCertFile() {
    var options = {
        hostname: "localhost",
        port: 3500,
        certFile: "cli/tests/tls/localhost.crt",
        keyFile: "cli/tests/tls/localhost.key"
    };
    var testDir = Deno.makeTempDirSync();
    var certFilename = testDir + "/cert.crt";
    Deno.writeFileSync(certFilename, new Uint8Array([]), {
        mode: 438
    });
    assertThrows(function() {
        Deno.listenTls(_object_spread_props(_object_spread({}, options), {
            certFile: certFilename
        }));
    }, Error);
});
unitTest({
    perms: {
        read: true,
        net: true
    }
}, function dialAndListenTLS() {
    return _async_to_generator(function() {
        var resolvable, hostname, port, listener, response, conn, w, r, body, writeResult, tpr, statusLine, m, _m, _, proto, status, ok, headers, contentLength, bodyBuf;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    resolvable = createResolvable();
                    hostname = "localhost";
                    port = 3500;
                    listener = Deno.listenTls({
                        hostname: hostname,
                        port: port,
                        certFile: "cli/tests/tls/localhost.crt",
                        keyFile: "cli/tests/tls/localhost.key"
                    });
                    response = encoder.encode("HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello World\n");
                    listener.accept().then(function(conn) {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        assert(conn.remoteAddr != null);
                                        assert(conn.localAddr != null);
                                        return [
                                            4,
                                            conn.write(response)
                                        ];
                                    case 1:
                                        _state.sent();
                                        // TODO(bartlomieju): this might be a bug
                                        setTimeout(function() {
                                            conn.close();
                                            resolvable.resolve();
                                        }, 0);
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    return [
                        4,
                        Deno.connectTls({
                            hostname: hostname,
                            port: port,
                            certFile: "cli/tests/tls/RootCA.pem"
                        })
                    ];
                case 1:
                    conn = _state.sent();
                    assert(conn.rid > 0);
                    w = new BufWriter(conn);
                    r = new BufReader(conn);
                    body = "GET / HTTP/1.1\r\nHost: ".concat(hostname, ":").concat(port, "\r\n\r\n");
                    return [
                        4,
                        w.write(encoder.encode(body))
                    ];
                case 2:
                    writeResult = _state.sent();
                    assertEquals(body.length, writeResult);
                    return [
                        4,
                        w.flush()
                    ];
                case 3:
                    _state.sent();
                    tpr = new TextProtoReader(r);
                    return [
                        4,
                        tpr.readLine()
                    ];
                case 4:
                    statusLine = _state.sent();
                    assert(statusLine !== null, "line must be read: ".concat(String(statusLine)));
                    m = statusLine.match(/^(.+?) (.+?) (.+?)$/);
                    assert(m !== null, "must be matched");
                    _m = _sliced_to_array(m, 4), _ = _m[0], proto = _m[1], status = _m[2], ok = _m[3];
                    assertEquals(proto, "HTTP/1.1");
                    assertEquals(status, "200");
                    assertEquals(ok, "OK");
                    return [
                        4,
                        tpr.readMIMEHeader()
                    ];
                case 5:
                    headers = _state.sent();
                    assert(headers !== null);
                    contentLength = parseInt(headers.get("content-length"));
                    bodyBuf = new Uint8Array(contentLength);
                    return [
                        4,
                        r.readFull(bodyBuf)
                    ];
                case 6:
                    _state.sent();
                    assertEquals(decoder.decode(bodyBuf), "Hello World\n");
                    conn.close();
                    listener.close();
                    return [
                        4,
                        resolvable
                    ];
                case 7:
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
        net: true
    }
}, function startTls() {
    return _async_to_generator(function() {
        var hostname, port, encoder, conn, writer, reader, line;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    hostname = "smtp.gmail.com";
                    port = 587;
                    encoder = new TextEncoder();
                    return [
                        4,
                        Deno.connect({
                            hostname: hostname,
                            port: port
                        })
                    ];
                case 1:
                    conn = _state.sent();
                    writer = new BufWriter(conn);
                    reader = new TextProtoReader(new BufReader(conn));
                    return [
                        4,
                        reader.readLine()
                    ];
                case 2:
                    line = _state.sent();
                    assert(line.startsWith("220"));
                    return [
                        4,
                        writer.write(encoder.encode("EHLO ".concat(hostname, "\r\n")))
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        writer.flush()
                    ];
                case 4:
                    _state.sent();
                    _state.label = 5;
                case 5:
                    return [
                        4,
                        reader.readLine()
                    ];
                case 6:
                    if (!(line = _state.sent())) return [
                        3,
                        7
                    ];
                    assert(line.startsWith("250"));
                    if (line.startsWith("250 ")) return [
                        3,
                        7
                    ];
                    return [
                        3,
                        5
                    ];
                case 7:
                    return [
                        4,
                        writer.write(encoder.encode("STARTTLS\r\n"))
                    ];
                case 8:
                    _state.sent();
                    return [
                        4,
                        writer.flush()
                    ];
                case 9:
                    _state.sent();
                    return [
                        4,
                        reader.readLine()
                    ];
                case 10:
                    line = _state.sent();
                    // Received the message that the server is ready to establish TLS
                    assertEquals(line, "220 2.0.0 Ready to start TLS");
                    return [
                        4,
                        Deno.startTls(conn, {
                            hostname: hostname
                        })
                    ];
                case 11:
                    conn = _state.sent();
                    writer = new BufWriter(conn);
                    reader = new TextProtoReader(new BufReader(conn));
                    // After that use TLS communication again
                    return [
                        4,
                        writer.write(encoder.encode("EHLO ".concat(hostname, "\r\n")))
                    ];
                case 12:
                    _state.sent();
                    return [
                        4,
                        writer.flush()
                    ];
                case 13:
                    _state.sent();
                    _state.label = 14;
                case 14:
                    return [
                        4,
                        reader.readLine()
                    ];
                case 15:
                    if (!(line = _state.sent())) return [
                        3,
                        16
                    ];
                    assert(line.startsWith("250"));
                    if (line.startsWith("250 ")) return [
                        3,
                        16
                    ];
                    return [
                        3,
                        14
                    ];
                case 16:
                    conn.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
