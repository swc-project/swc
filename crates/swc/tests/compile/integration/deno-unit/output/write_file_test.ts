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
import { unitTest, assertEquals, assertThrows, assertThrowsAsync } from "./test_util.ts";
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeFileSyncSuccess() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var filename = Deno.makeTempDirSync() + "/test.txt";
    Deno.writeFileSync(filename, data);
    var dataRead = Deno.readFileSync(filename);
    var dec = new TextDecoder("utf-8");
    var actual = dec.decode(dataRead);
    assertEquals("Hello", actual);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeFileSyncUrl() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var tempDir = Deno.makeTempDirSync();
    var fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
    Deno.writeFileSync(fileUrl, data);
    var dataRead = Deno.readFileSync(fileUrl);
    var dec = new TextDecoder("utf-8");
    var actual = dec.decode(dataRead);
    assertEquals("Hello", actual);
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
unitTest({
    perms: {
        write: true
    }
}, function writeFileSyncFail() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var filename = "/baddir/test.txt";
    // The following should fail because /baddir doesn't exist (hopefully).
    assertThrows(function() {
        Deno.writeFileSync(filename, data);
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        write: false
    }
}, function writeFileSyncPerm() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var filename = "/baddir/test.txt";
    // The following should fail due to no write permission
    assertThrows(function() {
        Deno.writeFileSync(filename, data);
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeFileSyncUpdateMode() {
    if (Deno.build.os !== "windows") {
        var enc = new TextEncoder();
        var data = enc.encode("Hello");
        var filename = Deno.makeTempDirSync() + "/test.txt";
        Deno.writeFileSync(filename, data, {
            mode: 493
        });
        assertEquals(Deno.statSync(filename).mode & 511, 493);
        Deno.writeFileSync(filename, data, {
            mode: 438
        });
        assertEquals(Deno.statSync(filename).mode & 511, 438);
    }
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeFileSyncCreate() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var filename = Deno.makeTempDirSync() + "/test.txt";
    // if create turned off, the file won't be created
    assertThrows(function() {
        Deno.writeFileSync(filename, data, {
            create: false
        });
    }, Deno.errors.NotFound);
    // Turn on create, should have no error
    Deno.writeFileSync(filename, data, {
        create: true
    });
    Deno.writeFileSync(filename, data, {
        create: false
    });
    var dataRead = Deno.readFileSync(filename);
    var dec = new TextDecoder("utf-8");
    var actual = dec.decode(dataRead);
    assertEquals("Hello", actual);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeFileSyncAppend() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var filename = Deno.makeTempDirSync() + "/test.txt";
    Deno.writeFileSync(filename, data);
    Deno.writeFileSync(filename, data, {
        append: true
    });
    var dataRead = Deno.readFileSync(filename);
    var dec = new TextDecoder("utf-8");
    var actual = dec.decode(dataRead);
    assertEquals("HelloHello", actual);
    // Now attempt overwrite
    Deno.writeFileSync(filename, data, {
        append: false
    });
    dataRead = Deno.readFileSync(filename);
    actual = dec.decode(dataRead);
    assertEquals("Hello", actual);
    // append not set should also overwrite
    Deno.writeFileSync(filename, data);
    dataRead = Deno.readFileSync(filename);
    actual = dec.decode(dataRead);
    assertEquals("Hello", actual);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeFileSuccess() {
    return _async_to_generator(function() {
        var enc, data, filename, dataRead, dec, actual;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    filename = Deno.makeTempDirSync() + "/test.txt";
                    return [
                        4,
                        Deno.writeFile(filename, data)
                    ];
                case 1:
                    _state.sent();
                    dataRead = Deno.readFileSync(filename);
                    dec = new TextDecoder("utf-8");
                    actual = dec.decode(dataRead);
                    assertEquals("Hello", actual);
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
}, function writeFileUrl() {
    return _async_to_generator(function() {
        var enc, data, tempDir, fileUrl, dataRead, dec, actual;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
                    return [
                        4,
                        Deno.writeFile(fileUrl, data)
                    ];
                case 2:
                    _state.sent();
                    dataRead = Deno.readFileSync(fileUrl);
                    dec = new TextDecoder("utf-8");
                    actual = dec.decode(dataRead);
                    assertEquals("Hello", actual);
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
        read: true,
        write: true
    }
}, function writeFileNotFound() {
    return _async_to_generator(function() {
        var enc, data, filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    filename = "/baddir/test.txt";
                    // The following should fail because /baddir doesn't exist (hopefully).
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.writeFile(filename, data)
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.NotFound)
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
        write: false
    }
}, function writeFilePerm() {
    return _async_to_generator(function() {
        var enc, data, filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    filename = "/baddir/test.txt";
                    // The following should fail due to no write permission
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.writeFile(filename, data)
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
}, function writeFileUpdateMode() {
    return _async_to_generator(function() {
        var enc, data, filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(Deno.build.os !== "windows")) return [
                        3,
                        3
                    ];
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    filename = Deno.makeTempDirSync() + "/test.txt";
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            mode: 493
                        })
                    ];
                case 1:
                    _state.sent();
                    assertEquals(Deno.statSync(filename).mode & 511, 493);
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            mode: 438
                        })
                    ];
                case 2:
                    _state.sent();
                    assertEquals(Deno.statSync(filename).mode & 511, 438);
                    _state.label = 3;
                case 3:
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
}, function writeFileCreate() {
    return _async_to_generator(function() {
        var enc, data, filename, dataRead, dec, actual;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    filename = Deno.makeTempDirSync() + "/test.txt";
                    // if create turned off, the file won't be created
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.writeFile(filename, data, {
                                                    create: false
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
                        }, Deno.errors.NotFound)
                    ];
                case 1:
                    _state.sent();
                    // Turn on create, should have no error
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            create: true
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            create: false
                        })
                    ];
                case 3:
                    _state.sent();
                    dataRead = Deno.readFileSync(filename);
                    dec = new TextDecoder("utf-8");
                    actual = dec.decode(dataRead);
                    assertEquals("Hello", actual);
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
}, function writeFileAppend() {
    return _async_to_generator(function() {
        var enc, data, filename, dataRead, dec, actual;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    filename = Deno.makeTempDirSync() + "/test.txt";
                    return [
                        4,
                        Deno.writeFile(filename, data)
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            append: true
                        })
                    ];
                case 2:
                    _state.sent();
                    dataRead = Deno.readFileSync(filename);
                    dec = new TextDecoder("utf-8");
                    actual = dec.decode(dataRead);
                    assertEquals("HelloHello", actual);
                    // Now attempt overwrite
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            append: false
                        })
                    ];
                case 3:
                    _state.sent();
                    dataRead = Deno.readFileSync(filename);
                    actual = dec.decode(dataRead);
                    assertEquals("Hello", actual);
                    // append not set should also overwrite
                    return [
                        4,
                        Deno.writeFile(filename, data)
                    ];
                case 4:
                    _state.sent();
                    dataRead = Deno.readFileSync(filename);
                    actual = dec.decode(dataRead);
                    assertEquals("Hello", actual);
                    return [
                        2
                    ];
            }
        });
    })();
});
