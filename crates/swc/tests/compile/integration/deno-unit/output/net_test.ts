function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
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
import { unitTest, assert, assertEquals, assertThrows, assertThrowsAsync, createResolvable, assertNotEquals } from "./test_util.ts";
unitTest({
    perms: {
        net: true
    }
}, function netTcpListenClose() {
    var listener = Deno.listen({
        hostname: "127.0.0.1",
        port: 3500
    });
    assert(listener.addr.transport === "tcp");
    assertEquals(listener.addr.hostname, "127.0.0.1");
    assertEquals(listener.addr.port, 3500);
    assertNotEquals(listener.rid, 0);
    listener.close();
});
unitTest({
    perms: {
        net: true
    },
    // TODO:
    ignore: Deno.build.os === "windows"
}, function netUdpListenClose() {
    var socket = Deno.listenDatagram({
        hostname: "127.0.0.1",
        port: 3500,
        transport: "udp"
    });
    assert(socket.addr.transport === "udp");
    assertEquals(socket.addr.hostname, "127.0.0.1");
    assertEquals(socket.addr.port, 3500);
    socket.close();
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function netUnixListenClose() {
    var filePath = Deno.makeTempFileSync();
    var socket = Deno.listen({
        path: filePath,
        transport: "unix"
    });
    assert(socket.addr.transport === "unix");
    assertEquals(socket.addr.path, filePath);
    socket.close();
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function netUnixPacketListenClose() {
    var filePath = Deno.makeTempFileSync();
    var socket = Deno.listenDatagram({
        path: filePath,
        transport: "unixpacket"
    });
    assert(socket.addr.transport === "unixpacket");
    assertEquals(socket.addr.path, filePath);
    socket.close();
});
unitTest({
    perms: {
        net: true
    }
}, function netTcpCloseWhileAccept() {
    return _async_to_generator(function() {
        var listener, p;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    listener = Deno.listen({
                        port: 4501
                    });
                    p = listener.accept();
                    listener.close();
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                p
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.BadResource, "Listener has been closed")
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
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function netUnixCloseWhileAccept() {
    return _async_to_generator(function() {
        var filePath, listener, p;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 1:
                    filePath = _state.sent();
                    listener = Deno.listen({
                        path: filePath,
                        transport: "unix"
                    });
                    p = listener.accept();
                    listener.close();
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                p
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.BadResource, "Listener has been closed")
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
    perms: {
        net: true
    }
}, function netTcpConcurrentAccept() {
    return _async_to_generator(function() {
        var listener, acceptErrCount, checkErr, p, p1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    listener = Deno.listen({
                        port: 4502
                    });
                    acceptErrCount = 0;
                    checkErr = function checkErr(e) {
                        if (e.message === "Listener has been closed") {
                            assertEquals(acceptErrCount, 1);
                        } else if (e.message === "Another accept task is ongoing") {
                            acceptErrCount++;
                        } else {
                            throw new Error("Unexpected error message");
                        }
                    };
                    p = listener.accept().catch(checkErr);
                    p1 = listener.accept().catch(checkErr);
                    return [
                        4,
                        Promise.race([
                            p,
                            p1
                        ])
                    ];
                case 1:
                    _state.sent();
                    listener.close();
                    return [
                        4,
                        Promise.all([
                            p,
                            p1
                        ])
                    ];
                case 2:
                    _state.sent();
                    assertEquals(acceptErrCount, 1);
                    return [
                        2
                    ];
            }
        });
    })();
});
// TODO(jsouto): Enable when tokio updates mio to v0.7!
unitTest({
    ignore: true,
    perms: {
        read: true,
        write: true
    }
}, function netUnixConcurrentAccept() {
    return _async_to_generator(function() {
        var filePath, listener, acceptErrCount, checkErr, p, p1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 1:
                    filePath = _state.sent();
                    listener = Deno.listen({
                        transport: "unix",
                        path: filePath
                    });
                    acceptErrCount = 0;
                    checkErr = function checkErr(e) {
                        if (e.message === "Listener has been closed") {
                            assertEquals(acceptErrCount, 1);
                        } else if (e.message === "Another accept task is ongoing") {
                            acceptErrCount++;
                        } else {
                            throw new Error("Unexpected error message");
                        }
                    };
                    p = listener.accept().catch(checkErr);
                    p1 = listener.accept().catch(checkErr);
                    return [
                        4,
                        Promise.race([
                            p,
                            p1
                        ])
                    ];
                case 2:
                    _state.sent();
                    listener.close();
                    return [
                        4,
                        [
                            p,
                            p1
                        ]
                    ];
                case 3:
                    _state.sent();
                    assertEquals(acceptErrCount, 1);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function netTcpDialListen() {
    return _async_to_generator(function() {
        var listener, conn, buf, readResult, readResult2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    listener = Deno.listen({
                        port: 3500
                    });
                    listener.accept().then(function(conn) {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        assert(conn.remoteAddr != null);
                                        assert(conn.localAddr.transport === "tcp");
                                        assertEquals(conn.localAddr.hostname, "127.0.0.1");
                                        assertEquals(conn.localAddr.port, 3500);
                                        return [
                                            4,
                                            conn.write(new Uint8Array([
                                                1,
                                                2,
                                                3
                                            ]))
                                        ];
                                    case 1:
                                        _state.sent();
                                        conn.close();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    return [
                        4,
                        Deno.connect({
                            hostname: "127.0.0.1",
                            port: 3500
                        })
                    ];
                case 1:
                    conn = _state.sent();
                    assert(conn.remoteAddr.transport === "tcp");
                    assertEquals(conn.remoteAddr.hostname, "127.0.0.1");
                    assertEquals(conn.remoteAddr.port, 3500);
                    assert(conn.localAddr != null);
                    buf = new Uint8Array(1024);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 2:
                    readResult = _state.sent();
                    assertEquals(3, readResult);
                    assertEquals(1, buf[0]);
                    assertEquals(2, buf[1]);
                    assertEquals(3, buf[2]);
                    assert(conn.rid > 0);
                    assert(readResult !== null);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 3:
                    readResult2 = _state.sent();
                    assertEquals(readResult2, null);
                    listener.close();
                    conn.close();
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
        read: true,
        write: true
    }
}, function netUnixDialListen() {
    return _async_to_generator(function() {
        var filePath, listener, conn, buf, readResult, readResult2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 1:
                    filePath = _state.sent();
                    listener = Deno.listen({
                        path: filePath,
                        transport: "unix"
                    });
                    listener.accept().then(function(conn) {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        assert(conn.remoteAddr != null);
                                        assert(conn.localAddr.transport === "unix");
                                        assertEquals(conn.localAddr.path, filePath);
                                        return [
                                            4,
                                            conn.write(new Uint8Array([
                                                1,
                                                2,
                                                3
                                            ]))
                                        ];
                                    case 1:
                                        _state.sent();
                                        conn.close();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    return [
                        4,
                        Deno.connect({
                            path: filePath,
                            transport: "unix"
                        })
                    ];
                case 2:
                    conn = _state.sent();
                    assert(conn.remoteAddr.transport === "unix");
                    assertEquals(conn.remoteAddr.path, filePath);
                    assert(conn.remoteAddr != null);
                    buf = new Uint8Array(1024);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 3:
                    readResult = _state.sent();
                    assertEquals(3, readResult);
                    assertEquals(1, buf[0]);
                    assertEquals(2, buf[1]);
                    assertEquals(3, buf[2]);
                    assert(conn.rid > 0);
                    assert(readResult !== null);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 4:
                    readResult2 = _state.sent();
                    assertEquals(readResult2, null);
                    listener.close();
                    conn.close();
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
        net: true
    }
}, function netUdpSendReceive() {
    return _async_to_generator(function() {
        var alice, bob, sent, byteLength, _ref, recvd, remote;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    alice = Deno.listenDatagram({
                        port: 3500,
                        transport: "udp"
                    });
                    assert(alice.addr.transport === "udp");
                    assertEquals(alice.addr.port, 3500);
                    assertEquals(alice.addr.hostname, "127.0.0.1");
                    bob = Deno.listenDatagram({
                        port: 4501,
                        transport: "udp"
                    });
                    assert(bob.addr.transport === "udp");
                    assertEquals(bob.addr.port, 4501);
                    assertEquals(bob.addr.hostname, "127.0.0.1");
                    sent = new Uint8Array([
                        1,
                        2,
                        3
                    ]);
                    return [
                        4,
                        alice.send(sent, bob.addr)
                    ];
                case 1:
                    byteLength = _state.sent();
                    assertEquals(byteLength, 3);
                    return [
                        4,
                        bob.receive()
                    ];
                case 2:
                    _ref = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        2
                    ]), recvd = _ref[0], remote = _ref[1];
                    assert(remote.transport === "udp");
                    assertEquals(remote.port, 3500);
                    assertEquals(recvd.length, 3);
                    assertEquals(1, recvd[0]);
                    assertEquals(2, recvd[1]);
                    assertEquals(3, recvd[2]);
                    alice.close();
                    bob.close();
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
        net: true
    }
}, function netUdpBorrowMutError() {
    return _async_to_generator(function() {
        var socket, a, b;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    socket = Deno.listenDatagram({
                        port: 4501,
                        transport: "udp"
                    });
                    // Panic happened on second send: BorrowMutError
                    a = socket.send(new Uint8Array(), socket.addr);
                    b = socket.send(new Uint8Array(), socket.addr);
                    return [
                        4,
                        Promise.all([
                            a,
                            b
                        ])
                    ];
                case 1:
                    _state.sent();
                    socket.close();
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
        read: true,
        write: true
    }
}, function netUnixPacketSendReceive() {
    return _async_to_generator(function() {
        var filePath, alice, bob, sent, byteLength, _ref, recvd, remote;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 1:
                    filePath = _state.sent();
                    alice = Deno.listenDatagram({
                        path: filePath,
                        transport: "unixpacket"
                    });
                    assert(alice.addr.transport === "unixpacket");
                    assertEquals(alice.addr.path, filePath);
                    bob = Deno.listenDatagram({
                        path: filePath,
                        transport: "unixpacket"
                    });
                    assert(bob.addr.transport === "unixpacket");
                    assertEquals(bob.addr.path, filePath);
                    sent = new Uint8Array([
                        1,
                        2,
                        3
                    ]);
                    return [
                        4,
                        alice.send(sent, bob.addr)
                    ];
                case 2:
                    byteLength = _state.sent();
                    assertEquals(byteLength, 3);
                    return [
                        4,
                        bob.receive()
                    ];
                case 3:
                    _ref = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        2
                    ]), recvd = _ref[0], remote = _ref[1];
                    assert(remote.transport === "unixpacket");
                    assertEquals(remote.path, filePath);
                    assertEquals(recvd.length, 3);
                    assertEquals(1, recvd[0]);
                    assertEquals(2, recvd[1]);
                    assertEquals(3, recvd[2]);
                    alice.close();
                    bob.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function netTcpListenIteratorBreakClosesResource() {
    return _async_to_generator(function() {
        var promise, addr, listener, conn1, conn2;
        function iterate(listener) {
            return _async_to_generator(function() {
                var i, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, conn, err;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            i = 0;
                            _iteratorAbruptCompletion = false, _didIteratorError = false;
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                6,
                                7,
                                12
                            ]);
                            _iterator = _async_iterator(listener);
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
                            conn = _value;
                            conn.close();
                            i++;
                            if (i > 1) {
                                return [
                                    3,
                                    5
                                ];
                            }
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
                            promise.resolve();
                            return [
                                2
                            ];
                    }
                });
            })();
        }
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    promise = createResolvable();
                    addr = {
                        hostname: "127.0.0.1",
                        port: 8888
                    };
                    listener = Deno.listen(addr);
                    iterate(listener);
                    return [
                        4,
                        new Promise(function(resolve, _) {
                            setTimeout(resolve, 100);
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 2:
                    conn1 = _state.sent();
                    conn1.close();
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 3:
                    conn2 = _state.sent();
                    conn2.close();
                    return [
                        4,
                        promise
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
        net: true
    }
}, function netTcpListenCloseWhileIterating() {
    return _async_to_generator(function() {
        var listener, nextWhileClosing, nextAfterClosing;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    listener = Deno.listen({
                        port: 8000
                    });
                    nextWhileClosing = listener[Symbol.asyncIterator]().next();
                    listener.close();
                    return [
                        4,
                        nextWhileClosing
                    ];
                case 1:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
                    nextAfterClosing = listener[Symbol.asyncIterator]().next();
                    return [
                        4,
                        nextAfterClosing
                    ];
                case 2:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
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
        net: true
    }
}, function netUdpListenCloseWhileIterating() {
    return _async_to_generator(function() {
        var socket, nextWhileClosing, nextAfterClosing;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    socket = Deno.listenDatagram({
                        port: 8000,
                        transport: "udp"
                    });
                    nextWhileClosing = socket[Symbol.asyncIterator]().next();
                    socket.close();
                    return [
                        4,
                        nextWhileClosing
                    ];
                case 1:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
                    nextAfterClosing = socket[Symbol.asyncIterator]().next();
                    return [
                        4,
                        nextAfterClosing
                    ];
                case 2:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
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
        read: true,
        write: true
    }
}, function netUnixListenCloseWhileIterating() {
    return _async_to_generator(function() {
        var filePath, socket, nextWhileClosing, nextAfterClosing;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filePath = Deno.makeTempFileSync();
                    socket = Deno.listen({
                        path: filePath,
                        transport: "unix"
                    });
                    nextWhileClosing = socket[Symbol.asyncIterator]().next();
                    socket.close();
                    return [
                        4,
                        nextWhileClosing
                    ];
                case 1:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
                    nextAfterClosing = socket[Symbol.asyncIterator]().next();
                    return [
                        4,
                        nextAfterClosing
                    ];
                case 2:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
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
        read: true,
        write: true
    }
}, function netUnixPacketListenCloseWhileIterating() {
    return _async_to_generator(function() {
        var filePath, socket, nextWhileClosing, nextAfterClosing;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filePath = Deno.makeTempFileSync();
                    socket = Deno.listenDatagram({
                        path: filePath,
                        transport: "unixpacket"
                    });
                    nextWhileClosing = socket[Symbol.asyncIterator]().next();
                    socket.close();
                    return [
                        4,
                        nextWhileClosing
                    ];
                case 1:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
                    nextAfterClosing = socket[Symbol.asyncIterator]().next();
                    return [
                        4,
                        nextAfterClosing
                    ];
                case 2:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        {
                            value: undefined,
                            done: true
                        }
                    ]);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    // FIXME(bartlomieju)
    ignore: true,
    perms: {
        net: true
    }
}, function netListenAsyncIterator() {
    return _async_to_generator(function() {
        var addr, listener, runAsyncIterator, conn, buf, readResult, readResult2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    addr = {
                        hostname: "127.0.0.1",
                        port: 3500
                    };
                    listener = Deno.listen(addr);
                    runAsyncIterator = function runAsyncIterator() {
                        return _async_to_generator(function() {
                            var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, conn, err;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _iteratorAbruptCompletion = false, _didIteratorError = false;
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            7,
                                            8,
                                            13
                                        ]);
                                        _iterator = _async_iterator(listener);
                                        _state.label = 2;
                                    case 2:
                                        return [
                                            4,
                                            _iterator.next()
                                        ];
                                    case 3:
                                        if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                                            3,
                                            6
                                        ];
                                        _value = _step.value;
                                        conn = _value;
                                        return [
                                            4,
                                            conn.write(new Uint8Array([
                                                1,
                                                2,
                                                3
                                            ]))
                                        ];
                                    case 4:
                                        _state.sent();
                                        conn.close();
                                        _state.label = 5;
                                    case 5:
                                        _iteratorAbruptCompletion = false;
                                        return [
                                            3,
                                            2
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
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    };
                    runAsyncIterator();
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 1:
                    conn = _state.sent();
                    buf = new Uint8Array(1024);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 2:
                    readResult = _state.sent();
                    assertEquals(3, readResult);
                    assertEquals(1, buf[0]);
                    assertEquals(2, buf[1]);
                    assertEquals(3, buf[2]);
                    assert(conn.rid > 0);
                    assert(readResult !== null);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 3:
                    readResult2 = _state.sent();
                    assertEquals(readResult2, null);
                    listener.close();
                    conn.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    // FIXME(bartlomieju)
    ignore: true,
    perms: {
        net: true
    }
}, function netCloseWriteSuccess() {
    return _async_to_generator(function() {
        var addr, listener, closeDeferred, conn, buf, readResult;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    addr = {
                        hostname: "127.0.0.1",
                        port: 3500
                    };
                    listener = Deno.listen(addr);
                    closeDeferred = createResolvable();
                    listener.accept().then(function(conn) {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            conn.write(new Uint8Array([
                                                1,
                                                2,
                                                3
                                            ]))
                                        ];
                                    case 1:
                                        _state.sent();
                                        return [
                                            4,
                                            closeDeferred
                                        ];
                                    case 2:
                                        _state.sent();
                                        conn.close();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 1:
                    conn = _state.sent();
                    conn.closeWrite(); // closing write
                    buf = new Uint8Array(1024);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 2:
                    readResult = _state.sent();
                    assertEquals(3, readResult);
                    assertEquals(1, buf[0]);
                    assertEquals(2, buf[1]);
                    assertEquals(3, buf[2]);
                    // Check write should be closed
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                conn.write(new Uint8Array([
                                                    1,
                                                    2,
                                                    3
                                                ]))
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.BrokenPipe)
                    ];
                case 3:
                    _state.sent();
                    closeDeferred.resolve();
                    listener.close();
                    conn.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    // FIXME(bartlomieju)
    ignore: true,
    perms: {
        net: true
    }
}, function netDoubleCloseWrite() {
    return _async_to_generator(function() {
        var addr, listener, closeDeferred, conn;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    addr = {
                        hostname: "127.0.0.1",
                        port: 3500
                    };
                    listener = Deno.listen(addr);
                    closeDeferred = createResolvable();
                    listener.accept().then(function(conn) {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            closeDeferred
                                        ];
                                    case 1:
                                        _state.sent();
                                        conn.close();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 1:
                    conn = _state.sent();
                    conn.closeWrite(); // closing write
                    assertThrows(function() {
                        // Duplicated close should throw error
                        conn.closeWrite();
                    }, Deno.errors.NotConnected);
                    closeDeferred.resolve();
                    listener.close();
                    conn.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function netHangsOnClose() {
    return _async_to_generator(function() {
        var acceptedConn, resolvable, addr, listener, conn, buf;
        function iteratorReq(listener) {
            return _async_to_generator(function() {
                var p, conn, nread, err;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            p = new Uint8Array(10);
                            return [
                                4,
                                listener.accept()
                            ];
                        case 1:
                            conn = _state.sent();
                            acceptedConn = conn;
                            _state.label = 2;
                        case 2:
                            _state.trys.push([
                                2,
                                7,
                                ,
                                8
                            ]);
                            _state.label = 3;
                        case 3:
                            if (!true) return [
                                3,
                                6
                            ];
                            return [
                                4,
                                conn.read(p)
                            ];
                        case 4:
                            nread = _state.sent();
                            if (nread === null) {
                                return [
                                    3,
                                    6
                                ];
                            }
                            return [
                                4,
                                conn.write(new Uint8Array([
                                    1,
                                    2,
                                    3
                                ]))
                            ];
                        case 5:
                            _state.sent();
                            return [
                                3,
                                3
                            ];
                        case 6:
                            return [
                                3,
                                8
                            ];
                        case 7:
                            err = _state.sent();
                            assert(!!err);
                            assert(_instanceof(err, Deno.errors.BadResource));
                            return [
                                3,
                                8
                            ];
                        case 8:
                            resolvable.resolve();
                            return [
                                2
                            ];
                    }
                });
            })();
        }
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    resolvable = createResolvable();
                    addr = {
                        hostname: "127.0.0.1",
                        port: 3500
                    };
                    listener = Deno.listen(addr);
                    iteratorReq(listener);
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 1:
                    conn = _state.sent();
                    return [
                        4,
                        conn.write(new Uint8Array([
                            1,
                            2,
                            3,
                            4
                        ]))
                    ];
                case 2:
                    _state.sent();
                    buf = new Uint8Array(10);
                    return [
                        4,
                        conn.read(buf)
                    ];
                case 3:
                    _state.sent();
                    conn.close();
                    acceptedConn.close();
                    listener.close();
                    return [
                        4,
                        resolvable
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
