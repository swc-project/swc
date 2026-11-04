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
import { unitTest, assert, assertThrows, assertThrowsAsync } from "./test_util.ts";
// Allow 10 second difference.
// Note this might not be enough for FAT (but we are not testing on such fs).
function assertFuzzyTimestampEquals(t1, t2) {
    assert(_instanceof(t1, Date));
    assert(Math.abs(t1.valueOf() - t2.valueOf()) < 10000);
}
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeSyncFileSuccess() {
    var testDir = Deno.makeTempDirSync();
    var filename = testDir + "/file.txt";
    Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
        mode: 438
    });
    var atime = 1000;
    var mtime = 50000;
    Deno.utimeSync(filename, atime, mtime);
    var fileInfo = Deno.statSync(filename);
    assertFuzzyTimestampEquals(fileInfo.atime, new Date(atime * 1000));
    assertFuzzyTimestampEquals(fileInfo.mtime, new Date(mtime * 1000));
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeSyncDirectorySuccess() {
    var testDir = Deno.makeTempDirSync();
    var atime = 1000;
    var mtime = 50000;
    Deno.utimeSync(testDir, atime, mtime);
    var dirInfo = Deno.statSync(testDir);
    assertFuzzyTimestampEquals(dirInfo.atime, new Date(atime * 1000));
    assertFuzzyTimestampEquals(dirInfo.mtime, new Date(mtime * 1000));
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeSyncDateSuccess() {
    var testDir = Deno.makeTempDirSync();
    var atime = new Date(1000000);
    var mtime = new Date(50000000);
    Deno.utimeSync(testDir, atime, mtime);
    var dirInfo = Deno.statSync(testDir);
    assertFuzzyTimestampEquals(dirInfo.atime, atime);
    assertFuzzyTimestampEquals(dirInfo.mtime, mtime);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeSyncFileDateSuccess() {
    var testDir = Deno.makeTempDirSync();
    var filename = testDir + "/file.txt";
    Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
        mode: 438
    });
    var atime = new Date();
    var mtime = new Date();
    Deno.utimeSync(filename, atime, mtime);
    var fileInfo = Deno.statSync(filename);
    assertFuzzyTimestampEquals(fileInfo.atime, atime);
    assertFuzzyTimestampEquals(fileInfo.mtime, mtime);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeSyncLargeNumberSuccess() {
    var testDir = Deno.makeTempDirSync();
    // There are Rust side caps (might be fs relate),
    // so JUST make them slightly larger than UINT32_MAX.
    var atime = 0x100000001;
    var mtime = 0x100000002;
    Deno.utimeSync(testDir, atime, mtime);
    var dirInfo = Deno.statSync(testDir);
    assertFuzzyTimestampEquals(dirInfo.atime, new Date(atime * 1000));
    assertFuzzyTimestampEquals(dirInfo.mtime, new Date(mtime * 1000));
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeSyncNotFound() {
    var atime = 1000;
    var mtime = 50000;
    assertThrows(function() {
        Deno.utimeSync("/baddir", atime, mtime);
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        read: true,
        write: false
    }
}, function utimeSyncPerm() {
    var atime = 1000;
    var mtime = 50000;
    assertThrows(function() {
        Deno.utimeSync("/some_dir", atime, mtime);
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function utimeFileSuccess() {
    return _async_to_generator(function() {
        var testDir, filename, atime, mtime, fileInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    testDir = Deno.makeTempDirSync();
                    filename = testDir + "/file.txt";
                    Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
                        mode: 438
                    });
                    atime = 1000;
                    mtime = 50000;
                    return [
                        4,
                        Deno.utime(filename, atime, mtime)
                    ];
                case 1:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assertFuzzyTimestampEquals(fileInfo.atime, new Date(atime * 1000));
                    assertFuzzyTimestampEquals(fileInfo.mtime, new Date(mtime * 1000));
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
}, function utimeDirectorySuccess() {
    return _async_to_generator(function() {
        var testDir, atime, mtime, dirInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    testDir = Deno.makeTempDirSync();
                    atime = 1000;
                    mtime = 50000;
                    return [
                        4,
                        Deno.utime(testDir, atime, mtime)
                    ];
                case 1:
                    _state.sent();
                    dirInfo = Deno.statSync(testDir);
                    assertFuzzyTimestampEquals(dirInfo.atime, new Date(atime * 1000));
                    assertFuzzyTimestampEquals(dirInfo.mtime, new Date(mtime * 1000));
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
}, function utimeDateSuccess() {
    return _async_to_generator(function() {
        var testDir, atime, mtime, dirInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    testDir = Deno.makeTempDirSync();
                    atime = new Date(100000);
                    mtime = new Date(5000000);
                    return [
                        4,
                        Deno.utime(testDir, atime, mtime)
                    ];
                case 1:
                    _state.sent();
                    dirInfo = Deno.statSync(testDir);
                    assertFuzzyTimestampEquals(dirInfo.atime, atime);
                    assertFuzzyTimestampEquals(dirInfo.mtime, mtime);
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
}, function utimeFileDateSuccess() {
    return _async_to_generator(function() {
        var testDir, filename, atime, mtime, fileInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    testDir = Deno.makeTempDirSync();
                    filename = testDir + "/file.txt";
                    Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
                        mode: 438
                    });
                    atime = new Date();
                    mtime = new Date();
                    return [
                        4,
                        Deno.utime(filename, atime, mtime)
                    ];
                case 1:
                    _state.sent();
                    fileInfo = Deno.statSync(filename);
                    assertFuzzyTimestampEquals(fileInfo.atime, atime);
                    assertFuzzyTimestampEquals(fileInfo.mtime, mtime);
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
}, function utimeNotFound() {
    return _async_to_generator(function() {
        var atime, mtime;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    atime = 1000;
                    mtime = 50000;
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.utime("/baddir", atime, mtime)
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
}, function utimeSyncPerm() {
    return _async_to_generator(function() {
        var atime, mtime;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    atime = 1000;
                    mtime = 50000;
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.utime("/some_dir", atime, mtime)
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
