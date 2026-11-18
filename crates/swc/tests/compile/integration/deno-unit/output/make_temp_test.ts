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
    perms: {
        write: true
    }
}, function makeTempDirSyncSuccess() {
    var dir1 = Deno.makeTempDirSync({
        prefix: "hello",
        suffix: "world"
    });
    var dir2 = Deno.makeTempDirSync({
        prefix: "hello",
        suffix: "world"
    });
    // Check that both dirs are different.
    assert(dir1 !== dir2);
    for(var _i = 0, _iter = [
        dir1,
        dir2
    ]; _i < _iter.length; _i++){
        var dir = _iter[_i];
        // Check that the prefix and suffix are applied.
        var lastPart = dir.replace(/^.*[\\\/]/, "");
        assert(lastPart.startsWith("hello"));
        assert(lastPart.endsWith("world"));
    }
    // Check that the `dir` option works.
    var dir3 = Deno.makeTempDirSync({
        dir: dir1
    });
    assert(dir3.startsWith(dir1));
    assert(/^[\\\/]/.test(dir3.slice(dir1.length)));
    // Check that creating a temp dir inside a nonexisting directory fails.
    assertThrows(function() {
        Deno.makeTempDirSync({
            dir: "/baddir"
        });
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function makeTempDirSyncMode() {
    var path = Deno.makeTempDirSync();
    var pathInfo = Deno.statSync(path);
    if (Deno.build.os !== "windows") {
        assertEquals(pathInfo.mode & 511, 448 & ~Deno.umask());
    }
});
unitTest(function makeTempDirSyncPerm() {
    // makeTempDirSync should require write permissions (for now).
    assertThrows(function() {
        Deno.makeTempDirSync({
            dir: "/baddir"
        });
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        write: true
    }
}, function makeTempDirSuccess() {
    return _async_to_generator(function() {
        var dir1, dir2, _i, _iter, dir, lastPart, dir3;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir({
                            prefix: "hello",
                            suffix: "world"
                        })
                    ];
                case 1:
                    dir1 = _state.sent();
                    return [
                        4,
                        Deno.makeTempDir({
                            prefix: "hello",
                            suffix: "world"
                        })
                    ];
                case 2:
                    dir2 = _state.sent();
                    // Check that both dirs are different.
                    assert(dir1 !== dir2);
                    for(_i = 0, _iter = [
                        dir1,
                        dir2
                    ]; _i < _iter.length; _i++){
                        dir = _iter[_i];
                        // Check that the prefix and suffix are applied.
                        lastPart = dir.replace(/^.*[\\\/]/, "");
                        assert(lastPart.startsWith("hello"));
                        assert(lastPart.endsWith("world"));
                    }
                    return [
                        4,
                        Deno.makeTempDir({
                            dir: dir1
                        })
                    ];
                case 3:
                    dir3 = _state.sent();
                    assert(dir3.startsWith(dir1));
                    assert(/^[\\\/]/.test(dir3.slice(dir1.length)));
                    // Check that creating a temp dir inside a nonexisting directory fails.
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.makeTempDir({
                                                    dir: "/baddir"
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
}, function makeTempDirMode() {
    return _async_to_generator(function() {
        var path, pathInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    path = _state.sent();
                    pathInfo = Deno.statSync(path);
                    if (Deno.build.os !== "windows") {
                        assertEquals(pathInfo.mode & 511, 448 & ~Deno.umask());
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
        write: true
    }
}, function makeTempFileSyncSuccess() {
    var file1 = Deno.makeTempFileSync({
        prefix: "hello",
        suffix: "world"
    });
    var file2 = Deno.makeTempFileSync({
        prefix: "hello",
        suffix: "world"
    });
    // Check that both dirs are different.
    assert(file1 !== file2);
    for(var _i = 0, _iter = [
        file1,
        file2
    ]; _i < _iter.length; _i++){
        var dir = _iter[_i];
        // Check that the prefix and suffix are applied.
        var lastPart = dir.replace(/^.*[\\\/]/, "");
        assert(lastPart.startsWith("hello"));
        assert(lastPart.endsWith("world"));
    }
    // Check that the `dir` option works.
    var dir1 = Deno.makeTempDirSync({
        prefix: "tempdir"
    });
    var file3 = Deno.makeTempFileSync({
        dir: dir1
    });
    assert(file3.startsWith(dir1));
    assert(/^[\\\/]/.test(file3.slice(dir1.length)));
    // Check that creating a temp file inside a nonexisting directory fails.
    assertThrows(function() {
        Deno.makeTempFileSync({
            dir: "/baddir"
        });
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function makeTempFileSyncMode() {
    var path = Deno.makeTempFileSync();
    var pathInfo = Deno.statSync(path);
    if (Deno.build.os !== "windows") {
        assertEquals(pathInfo.mode & 511, 384 & ~Deno.umask());
    }
});
unitTest(function makeTempFileSyncPerm() {
    // makeTempFileSync should require write permissions (for now).
    assertThrows(function() {
        Deno.makeTempFileSync({
            dir: "/baddir"
        });
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        write: true
    }
}, function makeTempFileSuccess() {
    return _async_to_generator(function() {
        var file1, file2, _i, _iter, dir, lastPart, dir1, file3;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempFile({
                            prefix: "hello",
                            suffix: "world"
                        })
                    ];
                case 1:
                    file1 = _state.sent();
                    return [
                        4,
                        Deno.makeTempFile({
                            prefix: "hello",
                            suffix: "world"
                        })
                    ];
                case 2:
                    file2 = _state.sent();
                    // Check that both dirs are different.
                    assert(file1 !== file2);
                    for(_i = 0, _iter = [
                        file1,
                        file2
                    ]; _i < _iter.length; _i++){
                        dir = _iter[_i];
                        // Check that the prefix and suffix are applied.
                        lastPart = dir.replace(/^.*[\\\/]/, "");
                        assert(lastPart.startsWith("hello"));
                        assert(lastPart.endsWith("world"));
                    }
                    // Check that the `dir` option works.
                    dir1 = Deno.makeTempDirSync({
                        prefix: "tempdir"
                    });
                    return [
                        4,
                        Deno.makeTempFile({
                            dir: dir1
                        })
                    ];
                case 3:
                    file3 = _state.sent();
                    assert(file3.startsWith(dir1));
                    assert(/^[\\\/]/.test(file3.slice(dir1.length)));
                    // Check that creating a temp file inside a nonexisting directory fails.
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.makeTempFile({
                                                    dir: "/baddir"
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
}, function makeTempFileMode() {
    return _async_to_generator(function() {
        var path, pathInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 1:
                    path = _state.sent();
                    pathInfo = Deno.statSync(path);
                    if (Deno.build.os !== "windows") {
                        assertEquals(pathInfo.mode & 511, 384 & ~Deno.umask());
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
