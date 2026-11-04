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
function readFileString(filename) {
    var dataRead = Deno.readFileSync(filename);
    var dec = new TextDecoder("utf-8");
    return dec.decode(dataRead);
}
function writeFileString(filename, s) {
    var enc = new TextEncoder();
    var data = enc.encode(s);
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
}
function assertSameContent(filename1, filename2) {
    var data1 = Deno.readFileSync(filename1);
    var data2 = Deno.readFileSync(filename2);
    assertEquals(data1, data2);
}
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function copyFileSyncSuccess() {
    var tempDir = Deno.makeTempDirSync();
    var fromFilename = tempDir + "/from.txt";
    var toFilename = tempDir + "/to.txt";
    writeFileString(fromFilename, "Hello world!");
    Deno.copyFileSync(fromFilename, toFilename);
    // No change to original file
    assertEquals(readFileString(fromFilename), "Hello world!");
    // Original == Dest
    assertSameContent(fromFilename, toFilename);
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function copyFileSyncByUrl() {
    var tempDir = Deno.makeTempDirSync();
    var fromUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/from.txt"));
    var toUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/to.txt"));
    writeFileString(fromUrl, "Hello world!");
    Deno.copyFileSync(fromUrl, toUrl);
    // No change to original file
    assertEquals(readFileString(fromUrl), "Hello world!");
    // Original == Dest
    assertSameContent(fromUrl, toUrl);
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
unitTest({
    perms: {
        write: true,
        read: true
    }
}, function copyFileSyncFailure() {
    var tempDir = Deno.makeTempDirSync();
    var fromFilename = tempDir + "/from.txt";
    var toFilename = tempDir + "/to.txt";
    // We skip initial writing here, from.txt does not exist
    assertThrows(function() {
        Deno.copyFileSync(fromFilename, toFilename);
    }, Deno.errors.NotFound);
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
unitTest({
    perms: {
        write: true,
        read: false
    }
}, function copyFileSyncPerm1() {
    assertThrows(function() {
        Deno.copyFileSync("/from.txt", "/to.txt");
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        write: false,
        read: true
    }
}, function copyFileSyncPerm2() {
    assertThrows(function() {
        Deno.copyFileSync("/from.txt", "/to.txt");
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function copyFileSyncOverwrite() {
    var tempDir = Deno.makeTempDirSync();
    var fromFilename = tempDir + "/from.txt";
    var toFilename = tempDir + "/to.txt";
    writeFileString(fromFilename, "Hello world!");
    // Make Dest exist and have different content
    writeFileString(toFilename, "Goodbye!");
    Deno.copyFileSync(fromFilename, toFilename);
    // No change to original file
    assertEquals(readFileString(fromFilename), "Hello world!");
    // Original == Dest
    assertSameContent(fromFilename, toFilename);
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function copyFileSuccess() {
    return _async_to_generator(function() {
        var tempDir, fromFilename, toFilename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    fromFilename = tempDir + "/from.txt";
                    toFilename = tempDir + "/to.txt";
                    writeFileString(fromFilename, "Hello world!");
                    return [
                        4,
                        Deno.copyFile(fromFilename, toFilename)
                    ];
                case 1:
                    _state.sent();
                    // No change to original file
                    assertEquals(readFileString(fromFilename), "Hello world!");
                    // Original == Dest
                    assertSameContent(fromFilename, toFilename);
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
}, function copyFileByUrl() {
    return _async_to_generator(function() {
        var tempDir, fromUrl, toUrl;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    fromUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/from.txt"));
                    toUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/to.txt"));
                    writeFileString(fromUrl, "Hello world!");
                    return [
                        4,
                        Deno.copyFile(fromUrl, toUrl)
                    ];
                case 1:
                    _state.sent();
                    // No change to original file
                    assertEquals(readFileString(fromUrl), "Hello world!");
                    // Original == Dest
                    assertSameContent(fromUrl, toUrl);
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
}, function copyFileFailure() {
    return _async_to_generator(function() {
        var tempDir, fromFilename, toFilename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    fromFilename = tempDir + "/from.txt";
                    toFilename = tempDir + "/to.txt";
                    // We skip initial writing here, from.txt does not exist
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.copyFile(fromFilename, toFilename)
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
}, function copyFileOverwrite() {
    return _async_to_generator(function() {
        var tempDir, fromFilename, toFilename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    fromFilename = tempDir + "/from.txt";
                    toFilename = tempDir + "/to.txt";
                    writeFileString(fromFilename, "Hello world!");
                    // Make Dest exist and have different content
                    writeFileString(toFilename, "Goodbye!");
                    return [
                        4,
                        Deno.copyFile(fromFilename, toFilename)
                    ];
                case 1:
                    _state.sent();
                    // No change to original file
                    assertEquals(readFileString(fromFilename), "Hello world!");
                    // Original == Dest
                    assertSameContent(fromFilename, toFilename);
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
        read: false,
        write: true
    }
}, function copyFilePerm1() {
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
                                                Deno.copyFile("/from.txt", "/to.txt")
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
        write: false
    }
}, function copyFilePerm2() {
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
                                                Deno.copyFile("/from.txt", "/to.txt")
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
