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
import { unitTest, assert, assertEquals, assertThrows, assertThrowsAsync } from "./test_util.ts";
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function chmodSyncSuccess() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var tempDir = Deno.makeTempDirSync();
    var filename = tempDir + "/test.txt";
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
    Deno.chmodSync(filename, 511);
    var fileInfo = Deno.statSync(filename);
    assert(fileInfo.mode);
    assertEquals(fileInfo.mode & 511, 511);
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function chmodSyncUrl() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var tempDir = Deno.makeTempDirSync();
    var fileUrl = new URL("file://".concat(tempDir, "/test.txt"));
    Deno.writeFileSync(fileUrl, data, {
        mode: 438
    });
    Deno.chmodSync(fileUrl, 511);
    var fileInfo = Deno.statSync(fileUrl);
    assert(fileInfo.mode);
    assertEquals(fileInfo.mode & 511, 511);
    Deno.removeSync(tempDir, {
        recursive: true
    });
});
// Check symlink when not on windows
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function chmodSyncSymlinkSuccess() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var tempDir = Deno.makeTempDirSync();
    var filename = tempDir + "/test.txt";
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
    var symlinkName = tempDir + "/test_symlink.txt";
    Deno.symlinkSync(filename, symlinkName);
    var symlinkInfo = Deno.lstatSync(symlinkName);
    assert(symlinkInfo.mode);
    var symlinkMode = symlinkInfo.mode & 511; // platform dependent
    Deno.chmodSync(symlinkName, 511);
    // Change actual file mode, not symlink
    var fileInfo = Deno.statSync(filename);
    assert(fileInfo.mode);
    assertEquals(fileInfo.mode & 511, 511);
    symlinkInfo = Deno.lstatSync(symlinkName);
    assert(symlinkInfo.mode);
    assertEquals(symlinkInfo.mode & 511, symlinkMode);
});
unitTest({
    perms: {
        write: true
    }
}, function chmodSyncFailure() {
    assertThrows(function() {
        var filename = "/badfile.txt";
        Deno.chmodSync(filename, 511);
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        write: false
    }
}, function chmodSyncPerm() {
    assertThrows(function() {
        Deno.chmodSync("/somefile.txt", 511);
    }, Deno.errors.PermissionDenied);
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function chmodSuccess() {
    return _async_to_generator(function() {
        var enc, data, tempDir, filename, fileInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    tempDir = Deno.makeTempDirSync();
                    filename = tempDir + "/test.txt";
                    Deno.writeFileSync(filename, data, {
                        mode: 438
                    });
                    return [
                        4,
                        Deno.chmod(filename, 511)
                    ];
                case 1:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.mode);
                    assertEquals(fileInfo.mode & 511, 511);
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
}, function chmodUrl() {
    return _async_to_generator(function() {
        var enc, data, tempDir, fileUrl, fileInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    tempDir = Deno.makeTempDirSync();
                    fileUrl = new URL("file://".concat(tempDir, "/test.txt"));
                    Deno.writeFileSync(fileUrl, data, {
                        mode: 438
                    });
                    return [
                        4,
                        Deno.chmod(fileUrl, 511)
                    ];
                case 1:
                    _state.sent();
                    fileInfo = Deno.statSync(fileUrl);
                    assert(fileInfo.mode);
                    assertEquals(fileInfo.mode & 511, 511);
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
// Check symlink when not on windows
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function chmodSymlinkSuccess() {
    return _async_to_generator(function() {
        var enc, data, tempDir, filename, symlinkName, symlinkInfo, symlinkMode, fileInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    data = enc.encode("Hello");
                    tempDir = Deno.makeTempDirSync();
                    filename = tempDir + "/test.txt";
                    Deno.writeFileSync(filename, data, {
                        mode: 438
                    });
                    symlinkName = tempDir + "/test_symlink.txt";
                    Deno.symlinkSync(filename, symlinkName);
                    symlinkInfo = Deno.lstatSync(symlinkName);
                    assert(symlinkInfo.mode);
                    symlinkMode = symlinkInfo.mode & 511; // platform dependent
                    return [
                        4,
                        Deno.chmod(symlinkName, 511)
                    ];
                case 1:
                    _state.sent();
                    // Just change actual file mode, not symlink
                    fileInfo = Deno.statSync(filename);
                    assert(fileInfo.mode);
                    assertEquals(fileInfo.mode & 511, 511);
                    symlinkInfo = Deno.lstatSync(symlinkName);
                    assert(symlinkInfo.mode);
                    assertEquals(symlinkInfo.mode & 511, symlinkMode);
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
}, function chmodFailure() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                var filename;
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            filename = "/badfile.txt";
                                            return [
                                                4,
                                                Deno.chmod(filename, 511)
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
        write: false
    }
}, function chmodPerm() {
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
                                                Deno.chmod("/somefile.txt", 511)
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
